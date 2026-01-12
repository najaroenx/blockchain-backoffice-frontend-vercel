import useSWR from "swr";

export interface Customer {
  id: string;
  merchantId: string;
  name: string;
  email: string;
  phone: string;
  walletAddress?: string;
  totalPurchases?: number;
  totalPoints?: number;
  couponsRedeemed?: number;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt?: string;
  wallet: {
    id: string;
    walletAddress: string;
    email: string;
    phoneNumber: string;
    type: string;
    status: string;
  };
}

interface UseCustomersOptions {
  merchantId: string;
  start?: number;
  end?: number;
}

interface UseCustomersResult {
  customers: Customer[];
  total: number;
  isLoading: boolean;
  isError: boolean;
  mutate: () => void;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch customers");
  }
  const total = res.headers.get("X-Total-Count") || "0";
  const data = await res.json();
  return { data, total: parseInt(total, 10) };
};

export function useCustomers({
  merchantId,
  start = 0,
  end = 20,
}: UseCustomersOptions): UseCustomersResult {
  const { data, error, isLoading, mutate } = useSWR(
    merchantId
      ? `/api/${merchantId}/customer?_start=${start}&_end=${end}`
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    customers: data?.data || [],
    total: data?.total || 0,
    isLoading,
    isError: !!error,
    mutate,
  };
}

export default useCustomers;
