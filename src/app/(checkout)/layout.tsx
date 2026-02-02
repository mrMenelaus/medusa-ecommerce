import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export const metadata: Metadata = {
  title: "Checkout - Viperr Store",
  description: "Complete your purchase",
};

export default function CheckoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="container p-4 mx-auto flex-1">{children}</main>
      <Footer />
    </>
  );
}
