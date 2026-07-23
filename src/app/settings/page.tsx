"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Save, User, Bell, Shield, Sliders, Check, AlertCircle, Sparkles } from "lucide-react"

import { PageHeader } from "@/components/layout/page-header"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

// ─── Zod Schemas for Settings ───────────────────────────────────────────────

const generalSettingsSchema = z.object({
  appName: z.string().min(2, "App name must be at least 2 characters"),
  supportEmail: z.string().email("Valid email address is required"),
})

const profileSettingsSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Valid email address is required"),
})

const securitySettingsSchema = z.object({
  currentPassword: z.string().min(6, "Current password must be at least 6 characters"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
})

type GeneralInput = z.infer<typeof generalSettingsSchema>
type ProfileInput = z.infer<typeof profileSettingsSchema>
type SecurityInput = z.infer<typeof securitySettingsSchema>

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState("general")

  // General Form RHF
  const generalForm = useForm<GeneralInput>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      appName: "LI Boomers Panel",
      supportEmail: "support@liboomers.com",
    },
  })

  // Profile Form RHF
  const profileForm = useForm<ProfileInput>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      fullName: "Admin User",
      email: "admin@liboomers.com",
    },
  })

  // Security Form RHF
  const securityForm = useForm<SecurityInput>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  })

  const onSaveGeneral = (data: GeneralInput) => {
    toast.success("General settings saved!", {
      description: `App Name: ${data.appName} | Email: ${data.supportEmail}`,
    })
  }

  const onSaveProfile = (data: ProfileInput) => {
    toast.success("Profile updated!", {
      description: `User: ${data.fullName} (${data.email})`,
    })
  }

  const onSaveSecurity = (data: SecurityInput) => {
    toast.success("Security credentials updated!", {
      description: "Your password was changed successfully.",
    })
    securityForm.reset()
  }

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        title="Settings & Configurations"
        description="Validated security protocols, user identity settings, and system telemetry controls."
        badge="Enterprise Config"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <TabsList className="bg-white/80 dark:bg-zinc-900/80 p-1.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-md shadow-sm">
          <TabsTrigger value="general" className="gap-2 text-xs rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white font-medium transition-all">
            <Sliders className="h-3.5 w-3.5" /> General
          </TabsTrigger>
          <TabsTrigger value="profile" className="gap-2 text-xs rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white font-medium transition-all">
            <User className="h-3.5 w-3.5" /> Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2 text-xs rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white font-medium transition-all">
            <Bell className="h-3.5 w-3.5" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2 text-xs rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white font-medium transition-all">
            <Shield className="h-3.5 w-3.5" /> Security
          </TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general">
          <Card className="rounded-3xl border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md shadow-sm">
            <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/60 pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Sliders className="h-4 w-4 text-purple-600" />
                General System Settings
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500">Configure application identification and caching protocols.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={generalForm.handleSubmit(onSaveGeneral)} className="space-y-6" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Application Name *</label>
                    <Input
                      {...generalForm.register("appName")}
                      className="h-9 text-xs rounded-xl border-zinc-200 dark:border-zinc-800 focus:border-purple-500"
                    />
                    {generalForm.formState.errors.appName && (
                      <p className="text-[11px] text-red-500 flex items-center gap-1 font-medium">
                        <AlertCircle className="h-3 w-3" /> {generalForm.formState.errors.appName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Support Email *</label>
                    <Input
                      {...generalForm.register("supportEmail")}
                      type="email"
                      className="h-9 text-xs rounded-xl border-zinc-200 dark:border-zinc-800 focus:border-purple-500"
                    />
                    {generalForm.formState.errors.supportEmail && (
                      <p className="text-[11px] text-red-500 flex items-center gap-1 font-medium">
                        <AlertCircle className="h-3 w-3" /> {generalForm.formState.errors.supportEmail.message}
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-zinc-900 dark:text-white">Demo Mode Telemetry</p>
                      <p className="text-[11px] text-zinc-500">Local signed identity tokens validation</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-zinc-900 dark:text-white">Catalog Cache Auto-Sync</p>
                      <p className="text-[11px] text-zinc-500">Revalidate product store every 60 seconds</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button type="submit" size="sm" className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold gap-2">
                    <Save className="h-3.5 w-3.5" /> Save General Settings
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="rounded-3xl border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md shadow-sm">
            <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/60 pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <User className="h-4 w-4 text-purple-600" />
                User Profile & Credentials
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500">Update your public identity and email preferences.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="space-y-4" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Full Name *</label>
                    <Input
                      {...profileForm.register("fullName")}
                      className="h-9 text-xs rounded-xl border-zinc-200 dark:border-zinc-800 focus:border-purple-500"
                    />
                    {profileForm.formState.errors.fullName && (
                      <p className="text-[11px] text-red-500 flex items-center gap-1 font-medium">
                        <AlertCircle className="h-3 w-3" /> {profileForm.formState.errors.fullName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Email Address *</label>
                    <Input
                      {...profileForm.register("email")}
                      type="email"
                      className="h-9 text-xs rounded-xl border-zinc-200 dark:border-zinc-800 focus:border-purple-500"
                    />
                    {profileForm.formState.errors.email && (
                      <p className="text-[11px] text-red-500 flex items-center gap-1 font-medium">
                        <AlertCircle className="h-3 w-3" /> {profileForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" size="sm" className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold gap-2">
                    <Save className="h-3.5 w-3.5" /> Update Profile
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card className="rounded-3xl border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md shadow-sm">
            <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/60 pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Bell className="h-4 w-4 text-purple-600" />
                Alert Channel Configurations
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500">Configure event alerts and automated notification digests.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-zinc-900 dark:text-white">Daily Executive Digest</p>
                  <p className="text-[11px] text-zinc-500">Receive morning summary of sales and user activity</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-zinc-900 dark:text-white">Security & Role Alerts</p>
                  <p className="text-[11px] text-zinc-500">Instant notification when a new admin user is invited</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card className="rounded-3xl border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md shadow-sm">
            <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/60 pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Shield className="h-4 w-4 text-purple-600" />
                Security Credentials & Passwords
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500">Update account password and active session security.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={securityForm.handleSubmit(onSaveSecurity)} className="space-y-4 max-w-md" noValidate>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Current Password *</label>
                  <Input
                    {...securityForm.register("currentPassword")}
                    type="password"
                    placeholder="••••••••"
                    className="h-9 text-xs rounded-xl border-zinc-200 dark:border-zinc-800 focus:border-purple-500"
                  />
                  {securityForm.formState.errors.currentPassword && (
                    <p className="text-[11px] text-red-500 flex items-center gap-1 font-medium">
                      <AlertCircle className="h-3 w-3" /> {securityForm.formState.errors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">New Password *</label>
                  <Input
                    {...securityForm.register("newPassword")}
                    type="password"
                    placeholder="••••••••"
                    className="h-9 text-xs rounded-xl border-zinc-200 dark:border-zinc-800 focus:border-purple-500"
                  />
                  {securityForm.formState.errors.newPassword && (
                    <p className="text-[11px] text-red-500 flex items-center gap-1 font-medium">
                      <AlertCircle className="h-3 w-3" /> {securityForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <Button type="submit" size="sm" className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold gap-2">
                    <Shield className="h-3.5 w-3.5" /> Update Password
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
