import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import type { StoreProduct } from "@medusajs/types";
import { Button } from "../ui/button";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";

export function ProductSkeleton() {
  return (
    <Card className="pt-0 overflow-clip">
      <CardContent>
      <Skeleton className="aspect-5/6"/>
        
      </CardContent>
      <CardHeader>
        <Skeleton className="w-full h-8" />
        <Skeleton className="w-full h-24" />
      </CardHeader>
      <CardFooter className="flex flex-col">
        <Skeleton className="w-full h-4" />
      </CardFooter>
    </Card>
  );
}
