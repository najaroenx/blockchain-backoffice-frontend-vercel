"use client";
import { useState, useEffect, useCallback } from "react";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import {
  getDashboardData,
  DashboardData,
  getCouponData,
  CouponData,
} from "@/app/dlt/merchant/[merchantId]/action";
import CouponCount from "./CouponCount/CouponCount";
import CouponValue from "./CouponValue/CouponValue";
import PointUseAndUserInformation from "./PointUseAndUserInformation/PointUseAndUserInformation";
import TransactionAndCoupon from "./TransactionAndCoupon/TransactionAndCoupon";
import PointDataTable from "./PointDataTable/PointDataTable";
import LoadingDefaultComponent from "../LoadingDefaultComponent";
// ── Component ──────────────────────────────────────────
interface ClientDashboardProps {
  merchantId: string;
}

const ClientDashboard = ({ merchantId }: ClientDashboardProps) => {
  // Dashboard data state
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [couponData, setCouponData] = useState<CouponData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 30))
      .toISOString()
      .split("T")[0],
  ); // default to 30 days ago
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0],
  ); // default to today

  const [selectedCurrency, setSelectedCurrency] = useState("");

  // Set default selectedCurrency to the first coupon when couponData loads
  useEffect(() => {
    if (couponData && couponData.coupons.length > 0 && !selectedCurrency) {
      setSelectedCurrency(couponData.coupons[0].id);
    }
  }, [couponData]); // eslint-disable-line react-hooks/exhaustive-deps

  const selected = couponData?.coupons.find((c) => c.id === selectedCurrency);

  const fetchDashboard = useCallback(async () => {
    try {
      const data = await getDashboardData(merchantId, {
        startDate,
        endDate,
        couponIds: selected ? (selected.id === "all" ? "" : selected.id) : "",
      });
      setDashboardData(data);
    } catch (err) {
      console.error("Failed to fetch dashboard:", err);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000); // Ensure loading spinner shows for at least 500ms
    }
  }, [merchantId, startDate, endDate, selected]);

  const fetchCouponData = useCallback(async () => {
    try {
      // Implement fetching coupon data if needed
      const result = await getCouponData(merchantId);
      setCouponData(result ? result : null);
    } catch (err) {
      console.error("Failed to fetch coupon data:", err);
    }
  }, [merchantId]);

  useEffect(() => {
    fetchCouponData();
  }, [fetchCouponData]);

  useEffect(() => {
    setIsLoading(true);
    fetchDashboard();
  }, [fetchDashboard]);

  // Live clock
  const [now, setNow] = useState(new Date());
  const [timeFilter, setTimeFilter] = useState("All");
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const getColumnDataTable = useCallback(() => {
    if (!dashboardData) return [];
    const pointCouponValue = dashboardData.couponValueByCurrency;
    if (!pointCouponValue || pointCouponValue.length === 0) return [];
    const keys = Object.keys(pointCouponValue[0]);
    let column: { key: string; label: string }[] = [];
    keys.forEach((k) => {
      column.push({
        key: k,
        label: k.charAt(0).toUpperCase() + k.slice(1),
      });
    });
    return column;
  }, [dashboardData]);
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-200">
        <div className="flex flex-col items-center gap-4">
          <LoadingDefaultComponent className="w-54 h-54" />
          <div className="text-center">
            <p className="text-white font-semibold text-lg">
              Loading dashboard...
            </p>
            <p className="text-gray-400 text-sm mt-1">Please wait</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-4 w-[50%] flex flex-row items-center gap-2">
        <h2 className="text-lg font-semibold text-white">เลือกคูปอง</h2>
        <Select
          className="w-[50%]"
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
          {couponData?.coupons.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.name}
            </MenuItem>
          ))}
        </Select>
      </div>
      {/* ━━━ Section: จำนวนคูปอง ━━━ */}
      {dashboardData?.couponCount && (
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">จำนวนคูปอง</h2>
          <CouponCount couponCount={dashboardData.couponCount} />
        </section>
      )}

      {/* ━━━ Section: มูลค่าคูปอง & Token ━━━ */}
      {dashboardData?.couponValue && (
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">
            มูลค่าคูปอง & Token
          </h2>
          <CouponValue
            couponValue={dashboardData.couponValue}
            thbToken={dashboardData.thbToken}
          />
        </section>
      )}

      {/* ━━━ Section: Point & End User ━━━ */}
      {dashboardData?.points && dashboardData?.endUsers && (
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">
            Point & End User
          </h2>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <PointUseAndUserInformation
              pointInfo={dashboardData.points}
              endUserInfo={dashboardData.endUsers}
            />
          </div>
        </section>
      )}

      {/* ━━━ Section: คูปองตามสกุล & Transaction ━━━ */}
      {dashboardData?.couponValueByCurrency && (
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">
            คูปองตามสกุล & Transaction
          </h2>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <TransactionAndCoupon
              transaction={dashboardData.transactions}
              couponByCurrency={dashboardData.couponValueByCurrency}
            />
          </div>
        </section>
      )}
      {/* ── Row 4: Deal Status Table ── */}
      <div className="bg-[#111827] rounded-2xl border border-gray-700/40 p-6">
        {dashboardData &&
          dashboardData.couponValueByCurrency &&
          dashboardData.couponValueByCurrency.length > 0 && (
            <PointDataTable
              title="มูลค่าคูปอง (Point)"
              columns={getColumnDataTable()}
              rows={dashboardData?.couponValueByCurrency || []}
            />
          )}
      </div>
    </div>
  );
};

export default ClientDashboard;
