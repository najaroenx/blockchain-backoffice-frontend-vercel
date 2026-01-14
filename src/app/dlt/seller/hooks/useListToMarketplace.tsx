"use client";

import useSWRMutation from "swr/mutation";

// Define the request body type
interface ListToMarketplaceRequest {
  voucherId: string;
  amount: number;
  pricePerUnitTHB: number;
  sellerWalletAddress: string;
}

// Fetcher function for POST request
// The `arg` parameter is passed from the `trigger` function
async function postToMarketplace(
  url: string,
  { arg }: { arg: ListToMarketplaceRequest }
) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create list to marketplace");
  }
  const data = await res.json();
  console.log("data?", data);
  return data;
}

export function useListToMarketplace() {
  /**
   * useSWRMutation is designed for mutations (POST, PUT, DELETE)
   * - trigger: function to call the API with the request body
   * - isMutating: loading state during the mutation
   * - data: response data after successful mutation
   * - error: error if the mutation failed
   * - reset: function to reset the state
   */
  const { trigger, isMutating, data, error, reset } = useSWRMutation(
    "/api/seller/list-to-marketplace",
    postToMarketplace
  );

  return {
    // Call this function with the request body to make the POST request
    // Example: listToMarketplace({ voucherId: "xxx", amount: 100, pricePerUnitTHB: 80, sellerWalletAddress: "0x..." })
    listToMarketplace: trigger,
    dataCreateOrder: data?.data,
    messageCreateOrder: data?.message,
    isLoadingCreateOrder: isMutating,
    isErrorCreateOrder: !!error,
    errorCreateOrder: error,
    reset, // Reset the state (clear data and error)
  };
}
