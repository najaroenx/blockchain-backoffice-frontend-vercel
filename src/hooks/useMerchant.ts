// hooks/useMerchants.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/libs/api";

export const useMerchants = () => {
  const queryClient = useQueryClient();

  // Fetch merchants
  const { data: merchants, isLoading: merchantLoading } = useQuery({
    queryKey: ["merchant"],
    queryFn: async () => await api("/api/merchant", { method: "GET" }),
  });

  // Create merchant
  const createMerchant = useMutation({
    mutationFn: async (newMerchant: { name: string; website: string }) => {
      return api("/api/merchant", {
        method: "POST",
        body: newMerchant,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merchant"] });
    },
  });

  return {
    merchants,
    merchantLoading,
    createMerchant,
  };
};
