"use client";
import { useState, useEffect, useCallback } from "react";
import {
  FormControlLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
} from "@mui/material";
import {
  getDashboardData,
  DashboardData,
  getCouponData,
  CouponData,
  getMerchantById,
  toggleMerchantStatus,
} from "@/app/dlt/merchant/[merchantId]/action";
import CouponCount from "./CouponCount/CouponCount";
import CouponValue from "./CouponValue/CouponValue";
import PointUseAndUserInformation from "./PointUseAndUserInformation/PointUseAndUserInformation";
import TransactionAndCoupon from "./TransactionAndCoupon/TransactionAndCoupon";
import PointDataTable from "./PointDataTable/PointDataTable";
import LoadingDefaultComponent from "../LoadingDefaultComponent";

const MIN_LOADING_MS = 1000;
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
  const startDate = new Date(new Date().setDate(new Date().getDate() - 30))
    .toISOString()
    .split("T")[0]; // default to 30 days ago
  const endDate = new Date().toISOString().split("T")[0]; // default to today

  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [isToggleEnabled, setIsToggleEnabled] = useState(true);
  const [isToggleLoading, setIsToggleLoading] = useState(false);

  // Set default selectedCurrency to the first coupon when couponData loads
  useEffect(() => {
    if (couponData && couponData.coupons.length > 0 && !selectedCurrency) {
      setSelectedCurrency(couponData.coupons[0].id);
    }
  }, [couponData]); // eslint-disable-line react-hooks/exhaustive-deps

  const selected = couponData?.coupons.find((c) => c.id === selectedCurrency);

  const fetchDashboard = useCallback(async () => {
    const loadingStartedAt = Date.now();

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
      const elapsedTime = Date.now() - loadingStartedAt;
      const remainingTime = Math.max(MIN_LOADING_MS - elapsedTime, 0);

      setTimeout(() => {
        setIsLoading(false);
      }, remainingTime);
    }
  }, [merchantId, startDate, endDate, selected]);

  const fetchCouponData = useCallback(async () => {
    try {
      // Implement fetching coupon data if needed
      const result = await getCouponData(merchantId);
      setCouponData(result);
    } catch (err) {
      console.error("Failed to fetch coupon data:", err);
    }
  }, [merchantId]);

  const fetchMerchantData = useCallback(async () => {
    try {
      const merchant = await getMerchantById(merchantId);
      if (merchant) {
        setIsToggleEnabled(merchant.status);
      }
    } catch (err) {
      console.error("Failed to fetch merchant detail:", err);
    }
  }, [merchantId]);

  const handleToggleChange = useCallback(
    async (checked: boolean) => {
      const previousValue = isToggleEnabled;
      const loadingStartedAt = Date.now();

      setIsToggleEnabled(checked);
      setIsToggleLoading(true);

      try {
        const success = await toggleMerchantStatus(merchantId, checked);
        if (!success) {
          setIsToggleEnabled(previousValue);
        }
      } catch (err) {
        console.error("Failed to update merchant status:", err);
        setIsToggleEnabled(previousValue);
      } finally {
        const elapsedTime = Date.now() - loadingStartedAt;
        const remainingTime = Math.max(MIN_LOADING_MS - elapsedTime, 0);

        setTimeout(() => {
          setIsToggleLoading(false);
        }, remainingTime);
      }
    },
    [isToggleEnabled, merchantId],
  );

  useEffect(() => {
    fetchCouponData();
    fetchMerchantData();
  }, [fetchCouponData, fetchMerchantData]);

  useEffect(() => {
    setIsLoading(true);
    fetchDashboard();
  }, [fetchDashboard]);

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

  const showPageOverlay = isLoading || isToggleLoading;
  const overlayTitle = isToggleLoading
    ? "กำลังอัปเดตสถานะร้านค้า..."
    : "Loading dashboard...";
  const overlaySubtitle = isToggleLoading
    ? "Please wait while the merchant status is being updated"
    : "Please wait";

  return (
    <div className="space-y-6">
      {showPageOverlay ? (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-200">
          <div className="flex flex-col items-center gap-4">
            <LoadingDefaultComponent className="w-54 h-54" />
            <div className="text-center">
              <p className="text-white font-semibold text-lg">{overlayTitle}</p>
              <p className="text-gray-400 text-sm mt-1">{overlaySubtitle}</p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <FormControlLabel
          className="m-0"
          control={
            <Switch
              checked={isToggleEnabled}
              disabled={isToggleLoading}
              onChange={(event) => handleToggleChange(event.target.checked)}
              sx={{
                width: 42,
                height: 26,
                padding: 0,
                display: "flex",
                "& .MuiSwitch-switchBase": {
                  padding: "3px",
                  transitionDuration: "200ms",
                  "&.Mui-checked": {
                    transform: "translateX(16px)",
                    color: "#fff",
                    "& + .MuiSwitch-track": {
                      backgroundColor: "#2563eb",
                      opacity: 1,
                      border: 0,
                    },
                  },
                },
                "& .MuiSwitch-thumb": {
                  boxSizing: "border-box",
                  width: 20,
                  height: 20,
                  boxShadow: "0 1px 3px rgba(15, 23, 42, 0.35)",
                },
                "& .MuiSwitch-track": {
                  borderRadius: 13,
                  backgroundColor: "rgba(148, 163, 184, 0.45)",
                  opacity: 1,
                },
                "& .Mui-disabled": {
                  opacity: 0.7,
                },
              }}
            />
          }
          label={isToggleEnabled ? "เปิดใช้งาน" : "ปิดใช้งาน"}
          sx={{
            gap: 1,
            color: isToggleEnabled ? "#11fb47" : "rgba(235, 16, 16, 0.95)",
            ".MuiFormControlLabel-label": {
              fontSize: "0.95rem",
              fontWeight: 500,
            },
          }}
        />

        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-white">เลือกคูปอง</h2>
          <Select
            className="w-[220px] md:w-[260px]"
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
                {c.name}{" "}({c.merchantRefName})
              </MenuItem>
            ))}
          </Select>
        </div>
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
        {dashboardData?.couponValueByCurrency?.length ? (
          <PointDataTable
            title="มูลค่าคูปอง (Point)"
            columns={getColumnDataTable()}
            rows={dashboardData?.couponValueByCurrency || []}
          />
        ) : null}
      </div>
    </div>
  );
};

export default ClientDashboard;
