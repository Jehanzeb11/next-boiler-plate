// ---------------------------------------------------------------------------
// Products — server-side data fetching
// Plain async functions called directly in Server Components.
// Swap the BASE_URL for your real backend when it's ready.
// ---------------------------------------------------------------------------

const BASE_URL = "https://fakestoreapi.com"

export interface ProductRating {
  rate: number
  count: number
}

export interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: ProductRating
}

async function apiFetch<T>(path: string, revalidate = 60): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    next: { revalidate },
  })
  if (!res.ok) {
    throw new Error(`Fetch failed: ${res.status} ${res.statusText} — ${BASE_URL}${path}`)
  }
  return res.json() as Promise<T>
}

export const getProducts = () => apiFetch<Product[]>("/products")
export const getProduct = (id: number) => apiFetch<Product>(`/products/${id}`)
export const getProductsByCategory = (category: string) =>
  apiFetch<Product[]>(`/products/category/${encodeURIComponent(category)}`)
export const getCategories = () => apiFetch<string[]>("/products/categories", 3600)
