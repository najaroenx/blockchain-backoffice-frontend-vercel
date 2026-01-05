"use client";

import useSWR from "swr";

// Fetcher function for SWR
const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch user session");
    return res.json();
  });

export function useVoucher() {
  /**
   * Calls /api/auth/session to get voucher data
   * - data: contains voucher data
   * - mutate: function to manually trigger a revalidation
   */
  const { data, error, mutate, isLoading } = useSWR("/api/seller", fetcher, {
    revalidateOnFocus: true, // Revalidate when the window is focused
    dedupingInterval: 5000, // Dedupe requests within 5 seconds
    revalidateOnReconnect: true,
  });

  return {
    vouchers: data?.data,
    message: data?.message,
    isLoading: isLoading,
    isError: !!error,
    error: error,
    refresh: mutate, // Use this to manually refresh voucher data (e.g., after a purchase)
  };
}
