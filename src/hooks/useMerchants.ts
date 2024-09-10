import { useStore } from "react-admin";
import useGetMerchantsByUserId from "./useGetMerchantByUserId";
import { useSwitchMerchant } from "./useSwitchMerchant";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const useMerchants = () => {
  const changeMerchant = useSwitchMerchant();
  const { handleRequestMerchant } = useGetMerchantsByUserId();
  const [currentMerchant, setCurrentMerchant] = useStore(
    "currentMerchant",
    null
  );

  const { data: merchants, isLoading: merchantLoading } = useQuery({
    queryFn: async () => await handleRequestMerchant(),
    queryKey: ["merchant"],
  });

  useEffect(() => {
    if (merchants?.length && !currentMerchant) {
      setCurrentMerchant(merchants[0].id);
    }
  }, [merchants, currentMerchant, setCurrentMerchant]);

  return {
    changeMerchant,
    merchants,
    currentMerchant,
    merchantLoading,
  };
};
