# Requirements Document

## Introduction

li-boomers-panel is a production-ready Next.js 16 admin panel boilerplate that consumes
external REST APIs exclusively. It provides a complete administrative interface with
multi-strategy authentication, role-based access control, full CRUD modules, analytics,
audit logging, file uploads, and a polished UI built on shadcn/ui and Tailwind CSS v4.

The system is built on top of the existing codebase: Next.js 16.2.10, React 19, TypeScript,
TanStack Query v5, Zustand v5, React Compiler, and the established patterns for fetcher,
query keys, and store architecture already present in the project.

Next.js 16 breaking changes that all implementation must respect:
- Route protection uses `proxy.ts` (not `middleware.ts`); the exported function is named `proxy`.
- All dynamic APIs (`cookies`, `headers`, `params`, `searchParams`) are async-only.
- `revalidateTag` requires a second `cacheLife` profile argument.
- `refresh()` from `next/cache` is used inside Server Actions to refresh the client router.
- Turbopack is the default bundler; no custom webpack configuration is introduced.

## Glossary

- **Panel**: The li-boomers-panel Next.js 16 application described in this document.
- **API Client**: The centralised HTTP layer in `src/lib/` that attaches auth tokens and
  communicates with the external backend; it never calls Next.js API route handlers for data.
- **Proxy**: The `src/proxy.ts` file (Next.js 16 renamed convention) that runs before every
  request to enforce session validity and role guards.
- **Session Cookie**: An HttpOnly, Secure, SameSite=Lax cookie named `session` that stores
  the encrypted JWT payload produced by the Panel's auth Server Actions.
- **Access Token**: A short-lived JWT (15 minutes) issued by the external backend.
- **Refresh Token**: A long-lived token (7 days) used to obtain a new Access Token silently.
- **Role**: One of three values — `admin`, `user`, or `viewer` — stored in the Session Cookie
  payload and in the Zustand auth store.
- **RBAC Guard**: Logic that prevents a user from viewing or mutating resources outside the
  permissions defined for their Role.
- **Data Table**: A TanStack Table v8 component that supports server-side pagination,
  column sorting, and column-level text filtering.
- **Server Action**: A Next.js `"use server"` function that runs exclusively on the server
  and is called directly from Client Components or forms.
- **Route Handler**: A `route.ts` file inside `src/app/api/auth/` used only for OAuth
  provider callbacks; no data-fetching route handlers are created.
- **Toast**: A transient, auto-dismissing notification rendered by a shadcn/ui Sonner wrapper.
- **Notification Center**: A persistent in-app inbox that lists unread and historical
  notifications fetched from the external backend.
- **Audit Log**: An immutable, append-only record of every state-changing action performed
  by a user, stored and returned by the external backend.
- **File Upload**: The act of sending a `multipart/form-data` request to the external
  backend's media endpoint and receiving a stable public URL in return.
- **Zod Schema**: A TypeScript-first schema used to validate all form inputs and API response
  shapes before they are consumed by the Panel.

## Requirements

### Requirement 1 — Credentials Authentication

**User Story:** As an admin user, I want to log in with my email and password so that I can
access the Panel's protected modules.

#### Acceptance Criteria

1. WHEN a visitor navigates to any protected route while no valid Session Cookie exists,
   THE Proxy SHALL redirect the visitor to `/auth/login`.

2. WHEN a user submits the login form with a valid email and password, THE AuthService
   SHALL call the external backend credentials endpoint, receive an Access Token and a
   Refresh Token, encrypt both into a Session Cookie payload using `jose` HS256, and set
   the Session Cookie with `httpOnly: true`, `secure: true`, `sameSite: "lax"`, and an
   expiry of 7 days.

3. WHEN the login Server Action completes successfully, THE AuthService SHALL call
   `refresh()` from `next/cache` and then redirect the user to `/dashboard`.

4. IF the external backend returns a 401 status for the credentials request, THEN THE
   AuthService SHALL return a `FormState` error object with `message: "Invalid email or
   password"` without setting a cookie.

5. IF the login form is submitted with an email that does not satisfy the Zod email pattern
   or a password shorter than 8 characters, THEN THE LoginForm SHALL display inline field
   errors before the Server Action is invoked.

6. WHEN a user clicks "Log out", THE AuthService SHALL delete the Session Cookie and
   redirect the user to `/auth/login`.

7. THE LoginPage SHALL be excluded from the Proxy matcher so that unauthenticated users can
   access it without being redirected.

### Requirement 2 — OAuth Authentication (Google and GitHub)

**User Story:** As a user, I want to log in with my Google or GitHub account so that I do not
need to manage a separate password.

#### Acceptance Criteria

1. THE AuthPage SHALL render a "Continue with Google" button and a "Continue with GitHub"
   button alongside the credentials form.

2. WHEN a user clicks "Continue with Google" or "Continue with GitHub", THE Panel SHALL
   redirect the user to the provider's OAuth authorisation URL constructed by the
   configured OAuth client.

3. WHEN the OAuth provider redirects back to `/api/auth/callback/[provider]`, THE
   OAuthRouteHandler SHALL exchange the authorisation code for provider tokens, call the
   external backend to upsert the user record, receive a Panel Access Token and Refresh
   Token, create the Session Cookie identically to Requirement 1 criterion 2, and redirect
   the user to `/dashboard`.

4. IF the OAuth provider returns an error parameter in the callback URL, THEN THE
   OAuthRouteHandler SHALL redirect the user to `/auth/login?error=oauth_failed`.

5. WHEN an OAuth login succeeds for the first time for a given provider account, THE Panel
   SHALL assign the `user` Role by default unless the external backend specifies otherwise.

### Requirement 3 — JWT Session Management and Silent Token Refresh

**User Story:** As a logged-in user, I want my session to stay active without re-logging in
so that I can work uninterrupted across long sessions.

#### Acceptance Criteria

1. THE API Client SHALL read the Access Token from the decrypted Session Cookie on every
   server-side fetch and attach it as a `Bearer` token in the `Authorization` header.

2. WHEN the API Client receives a 401 response from the external backend, THE API Client
   SHALL call the external backend's token-refresh endpoint with the Refresh Token, receive
   a new Access Token, update the Session Cookie with the new Access Token, and retry the
   original request exactly once.

3. IF the token-refresh endpoint also returns a 401 or 403, THEN THE API Client SHALL
   delete the Session Cookie and throw a `FetchError` with status 401, causing the Proxy
   to redirect the user to `/auth/login`.

4. THE SessionManager SHALL provide an `updateSession` Server Action that extends the
   Session Cookie expiry by 7 days whenever the user actively navigates within the Panel,
   preventing expiry during active use.

5. WHEN the Proxy decrypts the Session Cookie and the payload's `expiresAt` is in the past,
   THE Proxy SHALL delete the cookie and redirect the user to `/auth/login`.

6. THE Proxy SHALL run on all paths matched by
   `/((?!api|_next/static|_next/image|auth|favicon\.ico).*)` to protect all Panel routes.

### Requirement 4 — Role-Based Access Control

**User Story:** As an admin, I want role-based access control so that users and viewers
cannot access or mutate resources beyond their permission level.

#### Acceptance Criteria

1. THE Proxy SHALL read the `role` field from the decrypted Session Cookie payload and
   attach it as the `x-user-role` request header for downstream consumption.

2. WHEN a user with the `viewer` role attempts to navigate to any route under `/users`,
   `/products`, `/orders`, `/events`, `/roles`, or `/settings/permissions`, THE Proxy SHALL
   redirect the user to `/dashboard?error=forbidden`.

3. WHEN a user with the `user` role attempts to navigate to any route under `/roles` or
   `/audit-logs`, THE Proxy SHALL redirect the user to `/dashboard?error=forbidden`.

4. THE RBACGuard server utility SHALL expose a `requireRole(allowedRoles: Role[])` helper
   that Server Actions call at the top of their body; IF the session role is not in
   `allowedRoles`, THEN THE RBACGuard SHALL throw a `ForbiddenError` that the error boundary
   renders as a 403 page.

5. THE SidebarNav SHALL conditionally render navigation items based on the role stored in
   the Zustand auth store, hiding links the current user cannot access.

6. THE DataTable action buttons (Edit, Delete) for CRUD modules SHALL be hidden when the
   current user's role is `viewer`.

### Requirement 5 — Dashboard Layout

**User Story:** As a logged-in user, I want a consistent admin layout with a sidebar,
header, and breadcrumbs so that I can navigate the Panel efficiently.

#### Acceptance Criteria

1. THE AdminLayout SHALL render a collapsible `SidebarNav` on the left, a `Header` at the
   top, and a `main` content area that fills the remaining viewport.

2. THE SidebarNav SHALL display navigation groups: Dashboard, Users, Products, Orders,
   Events, Analytics, Roles & Permissions, Audit Logs, Notifications, and Settings.

3. WHEN the viewport width is below 768 px, THE AdminLayout SHALL collapse the SidebarNav
   to a hidden state and render a hamburger icon button in the Header that toggles it.

4. WHEN the hamburger button is pressed, THE SidebarNav SHALL slide in as an overlay panel
   over the content area.

5. THE Header SHALL display a breadcrumb trail reflecting the current route path, a
   theme-toggle button (light / dark / system), a notification bell showing the count of
   unread notifications, and a user avatar dropdown.

6. THE user avatar dropdown SHALL include links to "Profile", "Settings", and a "Log out"
   button.

7. THE SidebarNav collapse state SHALL be persisted in the Zustand `ui.store` so that it
   survives client-side navigation without re-mounting.

8. THE AdminLayout SHALL be implemented as a Next.js App Router `layout.tsx` under
   `src/app/(admin)/layout.tsx` using a route group so that auth pages share a separate
   layout.

### Requirement 6 — API Client Layer

**User Story:** As a developer, I want a centralised, typed API client so that all
external backend calls are consistent, authenticated, and error-handled in one place.

#### Acceptance Criteria

1. THE API Client SHALL extend the existing `fetcher` in `src/lib/fetcher.ts` with an
   `apiClient` wrapper that automatically reads the Access Token from the server-side
   Session Cookie (when called from Server Components or Server Actions) and injects it as
   a `Bearer` Authorization header.

2. THE API Client SHALL support a client-side variant that reads the Access Token from a
   non-sensitive in-memory Zustand store slice, enabling Client Component hooks to call
   the external backend directly without a server round-trip for non-sensitive reads.

3. THE API Client SHALL implement the silent refresh logic described in Requirement 3
   criterion 2 and 3.

4. THE API Client SHALL accept typed request and response generics so that TypeScript
   enforces the shape of every request body and every successful response.

5. IF the external backend returns an error response matching the `ApiError` type defined
   in `src/types/api.types.ts`, THEN THE API Client SHALL throw a `FetchError` containing
   the `status` and the first field error message when available.

6. THE `queryKeys` factory in `src/lib/query-keys.ts` SHALL be expanded to include keys
   for all modules: `products`, `orders`, `events`, `roles`, `auditLogs`, `notifications`,
   `analytics`, and `settings`.

### Requirement 7 — Data Table Component

**User Story:** As an admin, I want sortable, filterable, paginated data tables so that I can
efficiently browse and manage large record sets.

#### Acceptance Criteria

1. THE DataTable component SHALL be built with TanStack Table v8 and accept generic type
   parameters for row data.

2. THE DataTable SHALL support server-side pagination with `page` and `pageSize` query
   parameters; THE DataTable SHALL render a `PaginationBar` showing current page, total
   pages, and previous/next buttons.

3. THE DataTable SHALL support column sorting by attaching a sort indicator to each
   sortable column header; clicking a column header SHALL cycle through ascending,
   descending, and unsorted states.

4. THE DataTable SHALL render a global search input and per-column filter inputs where
   configured; filter changes SHALL debounce for 300 ms before triggering a query
   invalidation.

5. THE DataTable SHALL render an "Actions" column containing Edit and Delete icon buttons
   whose visibility is controlled by the RBAC Guard per Requirement 4 criterion 6.

6. WHEN data is loading or refetching, THE DataTable SHALL render a shadcn/ui `Skeleton`
   overlay over the table body without hiding the column headers.

7. IF a data fetch fails, THEN THE DataTable SHALL render an inline error state with a
   "Retry" button that calls `queryClient.invalidateQueries` for the relevant query key.

8. THE DataTable SHALL accept a `toolbarActions` slot for module-specific controls such as
   a "New Record" button.

### Requirement 8 — Users Module

**User Story:** As an admin, I want to list, create, edit, and delete user accounts so that I
can manage who has access to the system.

#### Acceptance Criteria

1. THE UsersPage SHALL render a DataTable displaying columns: Avatar, Name, Email, Role,
   Status, Created At, and Actions.

2. WHEN an admin clicks "New User", THE Panel SHALL open a Sheet (slide-over) containing a
   react-hook-form with Zod validation for name, email, role (select), and status (toggle).

3. WHEN the create-user form is submitted with valid data, THE UsersService SHALL call the
   external backend `POST /users` endpoint and, on success, call `updateTag("users")` to
   immediately refresh the users list.

4. WHEN an admin clicks the Edit button on a user row, THE Panel SHALL open a Sheet
   pre-populated with the user's current values via `useUser(id)`.

5. WHEN the edit-user form is submitted with valid data, THE UsersService SHALL call
   `PATCH /users/:id` and call `updateTag(\`user-\${id}\`)` on success.

6. WHEN an admin clicks the Delete button on a user row, THE Panel SHALL display a shadcn/ui
   `AlertDialog` for confirmation; on confirmation THE UsersService SHALL call
   `DELETE /users/:id` and call `updateTag("users")`.

7. IF any Users mutation returns a 422 or 400 status from the external backend, THEN THE
   UsersService SHALL map the `errors` field from the `ApiError` response back into
   react-hook-form field errors using `setError`.

### Requirement 9 — Products Module

**User Story:** As an admin, I want to manage the product catalogue so that I can keep
product information current.

#### Acceptance Criteria

1. THE ProductsPage SHALL render a DataTable with columns: Image (thumbnail), Title, Category,
   Price, Stock, Status, and Actions; it SHALL reuse and extend the existing
   `src/components/products/` components where compatible.

2. THE ProductsPage SHALL provide a category filter dropdown above the DataTable populated by
   the external backend's `/products/categories` endpoint.

3. WHEN an admin creates or updates a product, THE ProductForm SHALL include fields for title,
   description, price (numeric), stock (integer), category (select), status, and an image
   upload slot that delegates to the FileUpload component (Requirement 16).

4. WHEN a product is saved, THE ProductsService SHALL call `updateTag("products")` to
   immediately refresh the products list.

5. THE ProductsPage SHALL be accessible to `admin` and `user` roles; `viewer` roles SHALL
   see the table but the Actions column SHALL be hidden per Requirement 4 criterion 6.

### Requirement 10 — Orders Module

**User Story:** As an admin, I want to view and manage orders so that I can track fulfilment
status and handle customer requests.

#### Acceptance Criteria

1. THE OrdersPage SHALL render a DataTable with columns: Order ID, Customer Name, Total,
   Status (badge), Items Count, Created At, and Actions.

2. THE OrdersPage SHALL provide a status filter with options: All, Pending, Processing,
   Shipped, Delivered, Cancelled.

3. WHEN an admin clicks an order row or the View button, THE Panel SHALL navigate to
   `/orders/:id` which renders an `OrderDetailPage` showing line items, customer info,
   shipping address, payment method, and status history.

4. WHEN an admin updates an order's status via the `OrderStatusSelect` on the detail page,
   THE OrdersService SHALL call `PATCH /orders/:id` with the new status and call
   `updateTag(\`order-\${id}\`)`.

5. THE `admin` role SHALL be able to create manual orders; the `user` role SHALL only update
   order status; the `viewer` role SHALL only view orders.

### Requirement 11 — Events Module

**User Story:** As an admin, I want to create and manage events so that I can promote
scheduled activities to users.

#### Acceptance Criteria

1. THE EventsPage SHALL render a DataTable with columns: Title, Date, Location, Capacity,
   Registrations, Status, and Actions.

2. WHEN an admin creates or edits an event, THE EventForm SHALL include fields for title,
   description, start date-time, end date-time, location, capacity (integer), status
   (Draft / Published / Cancelled), and a cover image slot using the FileUpload component.

3. WHEN start date-time or end date-time is entered, THE EventForm Zod schema SHALL validate
   that end date-time is after start date-time; IF this condition is violated, THE EventForm
   SHALL display the error on the end date-time field.

4. WHEN an event is saved, THE EventsService SHALL call `updateTag("events")` to immediately
   refresh the events list.

### Requirement 12 — Roles and Permissions Module

**User Story:** As an admin, I want to manage roles and their associated permissions so that
I can control what each role can see and do.

#### Acceptance Criteria

1. THE RolesPage SHALL render a DataTable with columns: Role Name, Description, Permissions
   Count, and Actions; it SHALL be accessible to the `admin` role only.

2. WHEN an admin opens the role detail or creates a new role, THE RoleForm SHALL render a
   permissions matrix grouping permissions by resource (Users, Products, Orders, Events,
   Audit Logs, Settings) and action (View, Create, Edit, Delete) as checkboxes.

3. WHEN permissions are saved, THE RolesService SHALL call `PUT /roles/:id/permissions` with
   the full permissions array and call `updateTag("roles")`.

4. THE Panel SHALL display a non-editable "Built-in Roles" section showing the three
   system roles (`admin`, `user`, `viewer`) with their default permission sets; these SHALL
   NOT have Edit or Delete actions.

5. WHILE viewing the RolesPage, THE Panel SHALL fetch role data using a Server Component
   async call so the page is pre-rendered with role data and does not show a loading state
   on initial load.

### Requirement 13 — Analytics and Dashboard Module

**User Story:** As an admin, I want a dashboard with key metrics and charts so that I can
monitor the health of the system at a glance.

#### Acceptance Criteria

1. THE DashboardPage SHALL render a KPI strip of four stat cards: Total Users, Total Orders,
   Total Revenue, and Active Events; each card SHALL display the current value and a
   percentage change indicator compared to the previous period.

2. THE DashboardPage SHALL render a line chart showing order volume over the past 30 days
   using a charting library compatible with React 19 and Tailwind CSS v4.

3. THE DashboardPage SHALL render a bar chart showing revenue by product category for the
   current month.

4. THE DashboardPage SHALL render a pie or donut chart showing the distribution of orders by
   status.

5. THE DashboardPage SHALL render a "Recent Activity" table showing the 10 most recent audit
   log entries.

6. THE DashboardPage SHALL fetch all analytics data in parallel using independent TanStack
   Query queries so a slow chart endpoint does not block faster ones from rendering.

7. WHEN analytics data is loading, THE DashboardPage SHALL render shimmer Skeleton cards and
   chart placeholders of the same dimensions as the loaded components.

### Requirement 14 — Settings Module

**User Story:** As a user, I want to manage my profile and preferences so that the Panel
reflects my identity and workflow needs.

#### Acceptance Criteria

1. THE SettingsPage SHALL be divided into three tabs: Profile, Appearance, and Notifications.

2. WHEN a user updates the Profile tab (display name, avatar, email), THE ProfileService
   SHALL call `PATCH /users/me` and on success call `updateTag("me")` and update the
   Zustand auth store's `user` field.

3. WHEN the Appearance tab is active, THE ThemeSettings component SHALL render three radio
   cards for Light, Dark, and System themes; selecting a theme SHALL update the Zustand
   `ui.store` theme value and apply the corresponding CSS class to the `<html>` element
   without a page reload.

4. WHEN a user saves Notification preferences (email digests, in-app alerts per category),
   THE NotificationSettings component SHALL call `PATCH /notifications/preferences` and
   show a success Toast on completion.

5. THE SettingsPage Profile tab SHALL use a react-hook-form with Zod validation; the email
   field SHALL be read-only for OAuth-authenticated users.

### Requirement 15 — Notifications System

**User Story:** As a user, I want to receive and manage notifications so that I stay informed
about important system events.

#### Acceptance Criteria

1. THE Header SHALL display a bell icon button with an unread count badge that is populated
   from `GET /notifications/unread-count` polled every 60 seconds using TanStack Query's
   `refetchInterval`.

2. WHEN a user clicks the bell icon, THE NotificationCenter Popover SHALL open and render a
   list of the 20 most recent notifications with title, body, timestamp, and read status.

3. WHEN a user clicks an individual notification, THE NotificationCenter SHALL call
   `PATCH /notifications/:id/read` via a Server Action and call `updateTag("notifications")`
   to immediately mark it as read in the list.

4. THE NotificationCenter SHALL render a "Mark all as read" button; clicking it SHALL call
   `POST /notifications/read-all` and call `updateTag("notifications")`.

5. THE Panel SHALL provide a `useToast` convenience wrapper around the shadcn/ui Sonner
   component that other modules call with `{ type: "success" | "error" | "info", message }`.

6. WHEN any Server Action mutation completes successfully, THE calling component SHALL call
   `useToast` with `type: "success"` and a descriptive message.

7. IF any Server Action mutation throws a `FetchError`, THEN THE calling component SHALL call
   `useToast` with `type: "error"` and the error message.

### Requirement 16 — File and Media Upload

**User Story:** As an admin, I want to upload images and documents so that I can attach
media to products, events, and user profiles.

#### Acceptance Criteria

1. THE FileUpload component SHALL accept a `accept` prop (e.g. `"image/*"`) and a
   `maxSizeMb` prop; IF a user selects a file that exceeds `maxSizeMb`, THEN THE FileUpload
   SHALL display an error message below the drop zone without triggering an upload.

2. THE FileUpload component SHALL render a drag-and-drop zone and a "Browse files" button
   using the native `<input type="file">`.

3. WHEN a file is accepted, THE FileUpload component SHALL send a `multipart/form-data`
   POST request to the external backend's media endpoint using the API Client with the
   auth header attached.

4. WHILE an upload is in progress, THE FileUpload component SHALL render a progress bar
   reflecting the upload percentage obtained from the XMLHttpRequest `progress` event.

5. WHEN the upload completes successfully, THE FileUpload component SHALL call the
   `onUploadComplete(url: string)` callback prop with the public URL returned by the
   external backend.

6. IF the upload request fails, THEN THE FileUpload component SHALL display the error
   message returned by the external backend or "Upload failed. Please try again." as a
   fallback.

7. THE FileUpload component SHALL support multi-file upload when the `multiple` prop is
   `true`, uploading files sequentially and calling `onUploadComplete` once per file.

### Requirement 17 — Audit Logs Module

**User Story:** As an admin, I want to view an audit trail of all state-changing actions so
that I can investigate issues and maintain accountability.

#### Acceptance Criteria

1. THE AuditLogsPage SHALL render a DataTable with columns: Timestamp, Actor (user name +
   avatar), Action (verb), Resource Type, Resource ID, IP Address, and a Details toggle.

2. THE AuditLogsPage SHALL provide filter controls for date range (start/end date pickers),
   actor (user search), and action type (multi-select).

3. THE DataTable on the AuditLogsPage SHALL be read-only; no Edit, Delete, or Create actions
   SHALL be present.

4. WHEN a user expands the Details toggle on an audit log row, THE Panel SHALL display a
   JSON diff viewer showing the `before` and `after` state of the changed resource.

5. THE AuditLogsPage SHALL be accessible to the `admin` role only per Requirement 4
   criterion 3.

6. WHILE the date range filter spans more than 90 days, THE AuditLogsPage SHALL display an
   informational banner indicating that results may be paginated and export is recommended.
