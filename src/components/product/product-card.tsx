import Image from "next/image";
import type { StoreProduct } from "@medusajs/types";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ProductCard({ product }: { product: StoreProduct }) {
  return (
    <Link href={`product/${product.handle}`} className="group block">
      <div className="bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-accent/20">
          {product.thumbnail && (
            <Image
              alt={product.title || "product"}
              src={product.thumbnail}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )}
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          
          {/* Quick View Badge */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
              <ArrowRight className="h-4 w-4 text-primary" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          
          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          )}
          
          {/* Price - will be added later with variants */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              View Details
            </span>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>
    </Link>
  );
}
