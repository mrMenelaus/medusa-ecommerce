"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { StoreRegion } from "@medusajs/types";
import { medusa } from "@/lib/medusa";

const STORAGE_KEY = "region_id";

type RegionContextValue = {
  regions: StoreRegion[];
  region: StoreRegion;
  setRegion: (regionId: string) => Promise<void>;
};

const RegionContext = createContext<RegionContextValue | null>(null);

export function RegionProvider({
  children,
  regions,
}: {
  children: ReactNode;
  regions: StoreRegion[];
}) {
  const [regionId, setRegionId] = useState<string | null>(null);

  // init from storage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) setRegionId(stored)
  }, []);

  const region = regions.find((r) => r.id === regionId) ?? regions[0];

  async function setRegionFn(newRegionId: string) {
    setRegionId(newRegionId);
    localStorage.setItem(STORAGE_KEY, newRegionId);

    const cartId = localStorage.getItem("cartId");
    if (!cartId) return;

    try {
      await medusa.store.cart.update(cartId, { region_id: newRegionId });
    } catch (e) {
      console.error("Failed to update cart region", e);
    }
  }

  return (
    <RegionContext.Provider
      value={{
        regions,
        region,
        setRegion: setRegionFn,
      }}
    >
      {children}
    </RegionContext.Provider>
  );
}

export function useRegion() {
  const ctx = useContext(RegionContext);
  if (!ctx) throw new Error("useRegion outside provider");
  return ctx;
}
