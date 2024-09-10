import { useCallback } from "react";
import { useStore } from "react-admin";

export function useSwitchMerchant() {
  const [, setValue] = useStore("currentMerchant");
  const fn = useCallback(
    async (merchantId: string) => {
      try {
        setValue(merchantId);

        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    },
    [setValue]
  );

  return fn;
}
