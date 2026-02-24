import useSWR from "swr";
import useSWRMutation from "swr/mutation";

export interface Point {
  id: string;
  name: string;
  symbol: string;
  merchantId: string;
  frameSize?: number;
  slotSize?: number;
  contractAddress?: string;
  totalSupply?: number;
  initialSupply?: number;
  startDate?: number;
  endDate?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TransferPointPayload {
  transactionTypeId: string;
  amount: number;
  phone: string;
}

interface UsePointsOptions {
  merchantId: string;
}

interface UsePointOptions {
  merchantId: string;
  pointId: string;
}

interface UsePointsResult {
  points: Point[];
  total: number;
  isLoading: boolean;
  isError: boolean;
  mutate: () => void;
}

interface UsePointResult {
  point: Point | null;
  isLoading: boolean;
  isError: boolean;
  mutate: () => void;
}

// Fetcher for list
export const listFetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch points");
  }
  const total = res.headers.get("X-Total-Count") || "0";
  const data = await res.json();
  return { data, total: parseInt(total, 10) };
};

// Fetcher for single point
export const pointFetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch point");
  }
  return await res.json();
};

// Transfer fetcher (POST)
export const transferFetcher = async (
  url: string,
  { arg }: { arg: TransferPointPayload },
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
    throw new Error(error.message || "Failed to transfer points");
  }

  return await res.json();
};

// Hook: Get all points
export function usePoints({ merchantId }: UsePointsOptions): UsePointsResult {
  const { data, error, isLoading, mutate } = useSWR(
    merchantId ? `/api/${merchantId}/point` : null,
    listFetcher,
    {
      revalidateOnFocus: false,
    },
  );

  return {
    points: data?.data || [],
    total: data?.total || 0,
    isLoading,
    isError: !!error,
    mutate,
  };
}

// Hook: Get single point
export function usePoint({
  merchantId,
  pointId,
}: UsePointOptions): UsePointResult {
  const { data, error, isLoading, mutate } = useSWR(
    merchantId && pointId ? `/api/${merchantId}/point/${pointId}` : null,
    pointFetcher,
    {
      revalidateOnFocus: false,
    },
  );

  return {
    point: data || null,
    isLoading,
    isError: !!error,
    mutate,
  };
}

// Hook: Transfer point (POST to dedicated transfer endpoint)
export function useTransferPoint({ merchantId, pointId }: UsePointOptions) {
  const { trigger, isMutating, error, data } = useSWRMutation(
    merchantId && pointId ? `/api/${merchantId}/point/${pointId}/transfer` : null,
    transferFetcher,
  );

  return {
    transfer: trigger,
    isTransferring: isMutating,
    transferError: error,
    transferResult: data,
  };
}

export default usePoints;
