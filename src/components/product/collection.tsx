import { medusa } from "@/lib/medusa";
import { StoreCollection } from "@medusajs/types";
import { ProductCard } from "./product-card";

export async function Collection({
  collection,
}: {
  collection: StoreCollection;
}) {
  const { products } = await medusa.store.product.list({
    collection_id: collection.id,
  });

  return (
    <section className="py-16">
      {/* Collection Header */}
      <div className="mb-12 text-center">
        <h2
          className="text-4xl md:text-5xl font-bold text-foreground mb-4"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {collection.title}
        </h2>
        {collection.handle && (
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our curated selection of premium products
          </p>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </section>
  );
}
