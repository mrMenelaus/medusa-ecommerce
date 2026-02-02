"use client";

import { useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "../ui/carousel";
import Image from "next/image";
import { type StoreProductImage } from "@medusajs/types";
import { Empty, EmptyHeader } from "../ui/empty";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export function Gallery({ images }: { images: StoreProductImage[] | null }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const handleApiChange = (newApi: CarouselApi) => {
    setApi(newApi);

    if (newApi) {
      setCurrent(newApi.selectedScrollSnap());

      newApi.on("select", () => {
        setCurrent(newApi.selectedScrollSnap());
      });
    }
  };

  return images ? (
    <div className="flex flex-col gap-4">
      {/* Main Carousel */}
      <Carousel setApi={handleApiChange} className="w-full">
        <CarouselContent>
          {images.map((image) => (
            <CarouselItem key={image.id}>
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-accent/20">
                <Image
                  fill
                  src={image.url}
                  alt={image.id}
                  className="object-cover"
                  priority
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Thumbnail Navigation */}
      <div className="grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              "relative aspect-square rounded-lg overflow-hidden border-2 transition-all",
              current === index
                ? "border-primary shadow-md"
                : "border-transparent hover:border-border"
            )}
          >
            <Image
              src={image.url}
              alt={`Thumbnail ${index + 1}`}
              className="object-cover"
              fill
            />
          </button>
        ))}
      </div>
    </div>
  ) : (
    <div className="aspect-[4/5] flex items-center justify-center bg-accent/20 rounded-2xl">
      <Empty>
        <EmptyHeader>No images available</EmptyHeader>
      </Empty>
    </div>
  );
}
