import type { Metadata } from "next";
import { RootLayoutWrapper } from "@/components/layout/root-layout-wrapper";

export const metadata: Metadata = {
  title: "Viperr Store",
  description: "Shop the latest products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootLayoutWrapper>{children}</RootLayoutWrapper>;
}
