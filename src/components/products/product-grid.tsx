// Server Component
import { getProducts } from "@/actions/products"
import { ProductCard } from "./product-card"

export async function ProductGrid() {
  // Called on the server — data never touches the client bundle
  const products = await getProducts()

  return (
    <section aria-label="Products">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
