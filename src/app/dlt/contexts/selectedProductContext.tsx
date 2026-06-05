"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import {
  MarketplaceProduct,
  SellerListing,
} from "@/app/dlt/hooks/useMarketplace";

interface SelectedProductContextType {
  selectedProduct: MarketplaceProduct | null;
  selectedListing: SellerListing | null;
  setSelectedProduct: (product: MarketplaceProduct | null) => void;
  setSelectedListing: (listing: SellerListing | null) => void;
  clearSelection: () => void;
}

const SelectedProductContext = createContext<
  SelectedProductContextType | undefined
>(undefined);

export function SelectedProductProvider({ children }: { children: ReactNode }) {
  const [selectedProduct, setSelectedProduct] =
    useState<MarketplaceProduct | null>(null);
  const [selectedListing, setSelectedListing] = useState<SellerListing | null>(
    null
  );

  const clearSelection = () => {
    setSelectedProduct(null);
    setSelectedListing(null);
  };

  return (
    <SelectedProductContext.Provider
      value={{
        selectedProduct,
        selectedListing,
        setSelectedProduct,
        setSelectedListing,
        clearSelection,
      }}
    >
      {children}
    </SelectedProductContext.Provider>
  );
}

export function useSelectedProduct() {
  const context = useContext(SelectedProductContext);
  if (context === undefined) {
    throw new Error(
      "useSelectedProduct must be used within a SelectedProductProvider"
    );
  }
  return context;
}
