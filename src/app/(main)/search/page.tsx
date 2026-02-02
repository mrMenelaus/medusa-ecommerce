import { ProductCard } from "@/components/product/product-card";
import { ProductSkeleton } from "@/components/product/product-skeleton";
import { Button } from "@/components/ui/button";
import { Empty, EmptyHeader } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { medusa } from "@/lib/medusa";
import { SearchIcon } from "lucide-react";
import Form from "next/form";
import { cookies } from "next/headers";
import { Suspense } from "react";

export default function SearchProducts(props: PageProps<"/search">) {
  return (
    <div>
      <Suspense>
        <Banner />
      </Suspense>
      <Suspense>
        <SearchInput searchPromise={props.searchParams} />
      </Suspense>
      <CategoryFilter />
      <Suspense fallback={
        <div className="grid grid-cols-3 md:grid-cols-4">
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
        </div>
      }>
        <ProductList searchPromise={props.searchParams} />
      </Suspense>
    </div>
  );
}

async function SearchInput({
  searchPromise,
}: {
  searchPromise: Promise<{
    search: string;
  }>;
}) {
  const { search } = await searchPromise;
  return (
    <Form action="search" className="flex gap-2">
      <Input name="search" defaultValue={search} />
      <Button type="submit">
        <SearchIcon />
      </Button>
    </Form>
  );
}

async function CategoryFilter() {
  "use cache";
  const response = await medusa.store.category.list();
  return (
    <div>
      {response.product_categories.map((category) => (
        <div key={category.id}>{category.name}</div>
      ))}
    </div>
  );
}

async function ProductList({
  searchPromise,
}: {
  searchPromise: Promise<{
    page: number;
    search: string;
    categories: string[];
  }>;
}) {
  const { categories, page = 0, search } = await searchPromise;
  const limit = 10;
  const { products } = await medusa.store.product.list({
    // category_id: categories,
    limit,
    offset: limit * page,
    q:search
  });

  console.log(search);
  
  if (products.length === 0) {
    return (
      <Empty>
        <EmptyHeader>Nothing has found</EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {products.map((product) => (
        <ProductCard product={product} key={product.id} />
      ))}
    </div>
  );
}

async function Banner() {
  const token = (await cookies()).get("token");
  if (token) {
    await medusa.client.setToken(token.value)
    const customer = await medusa.store.customer.retrieve()
    return (
    <Item variant="outline">
      <ItemContent>
        <ItemTitle>Hello, {customer.customer.first_name}</ItemTitle>
        <ItemDescription>Thank you for registration</ItemDescription>
      </ItemContent>
    </Item>
  );
  }  
  return (
    <Item variant="outline">
      <ItemContent>
        <ItemTitle>Authorize for better experience</ItemTitle>
        <ItemDescription>Click the button</ItemDescription>
      </ItemContent>
    </Item>
  );
}
