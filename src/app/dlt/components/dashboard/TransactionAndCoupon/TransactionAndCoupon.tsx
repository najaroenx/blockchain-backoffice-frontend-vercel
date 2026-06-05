"use client"
import { useState } from "react";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import DefaultDonutChart from "../DefaultDonutChart";

interface ICouponByCurrency {
  currency: string;
  total: number;
  unsold: number;
  sold: number;
  unredeemed: number;
  redeemed: number;
}
interface ITransaction {
  transferPoint: number;
  purchaseCoupon: number;
}

interface ITransactionAndCouponProps {
  couponByCurrency: ICouponByCurrency[];
  transaction: ITransaction;
}

const TransactionAndCoupon = ({
  couponByCurrency,
  transaction,
}: ITransactionAndCouponProps) => {
  const [selectedCurrency, setSelectedCurrency] = useState(
    couponByCurrency.length > 0 ? couponByCurrency[0].currency : ""
  );

  const selected = couponByCurrency.find(
    (c) => c.currency === selectedCurrency
  );

  return (
    <>
      <div className="bg-[#111827] rounded-2xl p-6 border border-gray-700/40 [&>div]:border-0 [&>div]:bg-transparent [&>div]:p-0 [&>div]:rounded-none">
        <div className="mb-4">
          <Select
            value={selectedCurrency}
            onChange={(e: SelectChangeEvent) =>
              setSelectedCurrency(e.target.value)
            }
            size="small"
            sx={{
              minWidth: 160,
              width: "100%",
              color: "#fff",
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(107,114,128,0.4)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(107,114,128,0.7)",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#6366f1",
              },
              ".MuiSvgIcon-root": { color: "#9ca3af" },
              bgcolor: "#1f2937",
              borderRadius: "8px",
            }}
          >
            {couponByCurrency.map((c) => (
              <MenuItem key={c.currency} value={c.currency}>
                {c.currency}
              </MenuItem>
            ))}
          </Select>
        </div>
        <DefaultDonutChart
          title={`คูปองตามสกุล (${selectedCurrency})`}
          sub="ใบ"
          series={
            selected
              ? [selected.sold, selected.unsold, selected.redeemed, selected.unredeemed]
              : []
          }
          labels={["ขายแล้ว", "ยังไม่ขาย", "Redeemed", "Unredeemed"]}
        />
      </div>
      <DefaultDonutChart
        title="ข้อมูล Transaction"
        sub="รายการ"
        series={[transaction.transferPoint, transaction.purchaseCoupon]}
        labels={["จำนวนรายการโอน Point", "จำนวนรายการซื้อ Coupon"]}
      />
    </>
  );
};
export default TransactionAndCoupon;
