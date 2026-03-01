import "@/app/globals.css";
import { QueryProvider } from "@/lib/query-provider";
import { RegionProvider } from "../region/region-provider";
import { getRegions } from "../region/get-region";

export async function RootLayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const regions = await getRegions();
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <QueryProvider>
          <RegionProvider regions={regions}>{children}</RegionProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
