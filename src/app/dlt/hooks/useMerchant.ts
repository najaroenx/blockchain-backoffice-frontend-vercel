// hooks/useMerchants.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/libs/api";
import { useApiWithLoading, UseApiOptions } from "./useApiWithLoading";

interface CreateMerchantData {
  name: string;
  website: string;
  description?: string;
  imageUrl?: string;
  location?: string;
  phone?: string;
}

export const useMerchants = () => {
  const queryClient = useQueryClient();
  const { execute, isExecuting } = useApiWithLoading();

  // Fetch merchants
  const {
    data: merchants,
    isLoading: merchantLoading,
    refetch: refetchMerchants,
  } = useQuery({
    queryKey: ["merchant"],
    queryFn: async () => await api("/api/merchant", { method: "GET" }),
  });

  // Create merchant mutation
  const createMerchantMutation = useMutation({
    mutationFn: async (newMerchant: CreateMerchantData) => {
      return api("/api/merchant", {
        method: "POST",
        body: newMerchant,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merchant"] });
    },
  });

  // Create merchant with loading state
  const createMerchant = async (
    data: CreateMerchantData,
    options?: UseApiOptions
  ) => {
    return execute(() => createMerchantMutation.mutateAsync(data), {
      loadingText: "กำลังสร้าง Merchant...",
      successText: "สร้าง Merchant สำเร็จ!",
      errorText: "ไม่สามารถสร้าง Merchant ได้",
      ...options,
    });
  };

  // Fetch merchants with loading state (manual refresh)
  const fetchMerchants = async (options?: UseApiOptions) => {
    return execute(
      async () => {
        const result = await refetchMerchants();
        return result.data;
      },
      {
        loadingText: "กำลังโหลดข้อมูล Merchant...",
        successText: "โหลดข้อมูลสำเร็จ!",
        showSuccessOnComplete: false,
        ...options,
      }
    );
  };

  return {
    merchants,
    merchantLoading,
    isExecuting,
    createMerchant,
    fetchMerchants,
    refetchMerchants,
  };
};
