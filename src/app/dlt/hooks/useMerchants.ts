// hooks/useMerchants.ts

import useSWR from "swr";
import useSWRMutation from "swr/mutation";

// Types
export interface Merchant {
  id: string;
  name: string;
  website: string;
  description?: string;
  imageUrl?: string;
  location?: string;
  phone?: string;
  tel?: string;
  walletAddress?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMerchantPayload {
  name: string;
  website: string;
  description?: string;
  imageUrl?: string;
  location?: string;
  tel?: string;
}

interface UseMerchantsResult {
  merchants: Merchant[];
  total: number;
  isLoading: boolean;
  isError: boolean;
  mutate: () => void;
}

interface UseMerchantResult {
  merchant: Merchant | null;
  isLoading: boolean;
  isError: boolean;
  mutate: () => void;
}

// Fetcher for list
export const listFetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch merchants");
  }
  const total = res.headers.get("X-Total-Count") || "0";
  const data = await res.json();
  return { data, total: parseInt(total, 10) };
};

// Fetcher for single merchant
export const merchantFetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch merchant");
  }
  return await res.json();
};

// Create fetcher (POST)
export const createFetcher = async (
  url: string,
  { arg }: { arg: CreateMerchantPayload },
) => {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create merchant");
  }

  return await res.json();
};

// Hook: Get all merchants
export function useMerchants(): UseMerchantsResult {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/merchant`,
    listFetcher,
    {
      revalidateOnFocus: false,
    },
  );

  return {
    merchants: data?.data || [],
    total: data?.total || 0,
    isLoading,
    isError: !!error,
    mutate,
  };
}

// Hook: Get single merchant
export function useMerchant(merchantId: string): UseMerchantResult {
  const { data, error, isLoading, mutate } = useSWR(
    merchantId ? `/api/merchant/${merchantId}` : null,
    merchantFetcher,
    {
      revalidateOnFocus: false,
    },
  );

  return {
    merchant: data || null,
    isLoading,
    isError: !!error,
    mutate,
  };
}

// Hook: Create merchant (POST)
export function useCreateMerchant() {
  const { trigger, isMutating, error, data } = useSWRMutation(
    `/api/merchant`,
    createFetcher,
  );

  return {
    createMerchant: trigger,
    isCreating: isMutating,
    createError: error,
    createResult: data,
  };
}

export default useMerchants;
