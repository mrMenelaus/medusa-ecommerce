"use cache";

import { Gallery } from "@/components/product/gallery";
import { ProductCard } from "@/components/product/product-card";
import { SelectVariant } from "@/components/product/select-variant";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { hard } from "@/lib/constants";
import { medusa } from "@/lib/medusa";
import { Truck, Shield, RotateCcw } from "lucide-react";

type ProductMetadata = {
  long?: string;
};

export async function generateStaticParams() {
  const response = await medusa.store.product.list();
  return response.products.map(({ handle }) => ({ handle }));
}

export default async function ProductDetails({
  params,
}: PageProps<"/product/[handle]">) {
  const { handle } = await params;
  const response = await medusa.store.product.list({
    handle,
    fields: "*variants.calculated_price",
    region_id: hard.region,
  });
  const product = response.products[0];

  const metadata = product.metadata as ProductMetadata;

  const relatedProducts = await medusa.store.product.list({
    collection_id: product.collection?.id,
    limit: 4,
  });

  return (
    <div className="py-8 space-y-16">
      {/* Product Detail Section */}
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Gallery */}
        <div>
          <Gallery images={product.images} />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Title & Price */}
          <div className="space-y-3">
            <h1
              className="text-4xl lg:text-5xl font-bold text-foreground leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {product.title}
            </h1>
            {product.subtitle && (
              <p className="text-xl text-muted-foreground">{product.subtitle}</p>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="prose prose-sm text-muted-foreground">
              <p className="leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Variant Selection */}
          <div className="pt-4">
            <SelectVariant product={product} />
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
            <FeatureItem
              icon={<Truck className="h-5 w-5" />}
              title="Free Shipping"
              description="On orders over $50"
            />
            <FeatureItem
              icon={<Shield className="h-5 w-5" />}
              title="Secure Payment"
              description="100% protected"
            />
            <FeatureItem
              icon={<RotateCcw className="h-5 w-5" />}
              title="Easy Returns"
              description="30-day guarantee"
            />
          </div>

          {/* Additional Info */}
          {metadata?.long && (
            <div className="pt-6">
              <Accordion type="single" collapsible className="border-t">
                <AccordionItem value="details" className="border-none">
                  <AccordionTrigger className="text-base font-semibold hover:no-underline py-4">
                    Product Details
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    {metadata.long}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.products.length > 0 && (
        <section className="border-t pt-16">
          <div className="mb-12">
            <h2
              className="text-3xl lg:text-4xl font-bold text-foreground mb-3"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              You May Also Like
            </h2>
            <p className="text-muted-foreground">
              Discover more products from our collection
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.products
              .filter((p) => p.id !== product.id)
              .slice(0, 4)
              .map((relatedProduct) => (
                <ProductCard product={relatedProduct} key={relatedProduct.id} />
              ))}
          </div>
        </section>
      )}
    </div>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center p-4 rounded-xl bg-accent/30">
      <div className="mb-2 text-primary">{icon}</div>
      <h3 className="font-semibold text-sm mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
