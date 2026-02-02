import { Collection } from "@/components/product/collection";
import { tags } from "@/lib/constants";
import { medusa } from "@/lib/medusa";
import { cacheTag } from "next/cache";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, TrendingUp, Award } from "lucide-react";

export default async function Home() {
  "use cache";
  cacheTag(tags.products);

  const collections = await medusa.store.collection.list();
  
  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Background Decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-accent/30 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              <span>New Collection Available</span>
            </div>

            {/* Headline */}
            <h1
              className="text-5xl md:text-7xl font-bold text-foreground leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Discover Your
              <br />
              <span className="text-primary">Perfect Style</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience premium quality products curated just for you. 
              Elevate your lifestyle with our exclusive collection.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button size="lg" className="group" asChild>
                <Link href="/#collections">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/new">View New Arrivals</Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
              <TrustItem
                icon={<TrendingUp className="h-6 w-6" />}
                value="10K+"
                label="Happy Customers"
              />
              <TrustItem
                icon={<Award className="h-6 w-6" />}
                value="500+"
                label="Premium Products"
              />
              <TrustItem
                icon={<Sparkles className="h-6 w-6" />}
                value="4.9"
                label="Average Rating"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section id="collections" className="space-y-24">
        {collections.collections.map((collection) => (
          <Collection key={collection.id} collection={collection} />
        ))}
      </section>

      {/* Newsletter Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/20 to-primary/5 -z-10" />
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2
              className="text-3xl md:text-4xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Stay Updated
            </h2>
            <p className="text-muted-foreground">
              Subscribe to our newsletter for exclusive offers, new arrivals, and style tips.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button size="lg" className="whitespace-nowrap">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function TrustItem({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-primary">{icon}</div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
