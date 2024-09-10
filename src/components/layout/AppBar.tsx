import * as React from "react";
import { AppBar } from "react-admin";
import { MerchantSelectDropDown } from "../customs/MerchantSelectDropDown";
import { useMerchants } from "@/hooks/useMerchants";

export const CustomAppBar = () => {
  const { merchants, merchantLoading, currentMerchant, changeMerchant } =
    useMerchants();

  return (
    <AppBar color="default" className="bg-[#FF8901] text-white py-1">
      {!merchantLoading && merchants?.length > 0 && currentMerchant && (
        <MerchantSelectDropDown
          merchants={merchants}
          currentMerchant={currentMerchant}
          changeMerchant={changeMerchant}
        />
      )}
      <div className="flex-1"></div>
    </AppBar>
  );
};
