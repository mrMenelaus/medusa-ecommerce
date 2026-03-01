import { medusa } from "@/lib/medusa";

export async function getRegions() {
  "use cache";
  const response = await medusa.store.region.list();
  return response.regions
}
