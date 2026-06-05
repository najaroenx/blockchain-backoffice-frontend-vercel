"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import PeopleIcon from "@mui/icons-material/People";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { ApexOptions } from "apexcharts";
import { api } from "@/libs/api";
import { MerchantRefDashboardResponse } from "@/app/api/[id]/user-dashboard/route";
import { MerchantRefStoreResponse } from "@/app/api/merchant-ref-store/route";
// Dynamic import for ApexCharts (no SSR)
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// Stats Item Component - Light Theme
const StatsItem = ({
  label,
  value,
  color = "text-gray-800",
}: {
  label: string;
  value: string | number;
  color?: string;
}) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
    <p className="text-sm text-gray-500 font-semibold">{label}</p>
    <span className={`text-lg font-semibold ${color}`}>{value}</span>
  </div>
);

// Section Card Component - Light Theme
const SectionCard = ({
  title,
  icon,
  iconColor,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  iconColor: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
    <div className="flex items-center gap-3 mb-6">
      <div
        className={`w-10 h-10 rounded-xl ${iconColor} flex items-center justify-center`}
      >
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    {children}
  </div>
);

// Stats Card - Light Theme
const StatCard = ({
  value,
  label,
  color = "text-gray-800",
}: {
  value: string | number;
  label: string;
  color?: string;
}) => (
  <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
    <p className="text-xs text-gray-500 mt-1">{label}</p>
  </div>
);

// ... (existing imports, but remove duplicate React dynamic if needed)

export default function UserMerchantDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const merchantRefFromUrl = searchParams.get("merchantRef") || "";
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<MerchantRefDashboardResponse | null>(null);
  const [merchantRefStores, setMerchantRefStores] = useState<MerchantRefStoreResponse[]>([]);
  const [selectedMerchantRef, setSelectedMerchantRef] = useState<string>(merchantRefFromUrl);
  const [isLoadingStores, setIsLoadingStores] = useState(true);

  // Fetch merchant ref stores list
  useEffect(() => {
    const fetchMerchantRefStores = async () => {
      setIsLoadingStores(true);
      try {
        const result = await api("/api/merchant-ref-store", {
          method: "GET",
        });
        setMerchantRefStores(result.data || []);
        // If no merchant ref selected and we have stores, select the first one
        if (!selectedMerchantRef && result.data?.length > 0) {
          setSelectedMerchantRef(result.data[0].merchantRef);
        }
      } catch (error) {
        console.error("Failed to fetch merchant ref stores:", error);
      } finally {
        setIsLoadingStores(false);
      }
    };
    fetchMerchantRefStores();
  }, []);

  // Update URL when selectedMerchantRef changes
  useEffect(() => {
    if (selectedMerchantRef && selectedMerchantRef !== merchantRefFromUrl) {
      router.push(`/dlt/user-merchant?merchantRef=${selectedMerchantRef}`);
    }
  }, [selectedMerchantRef]);

  // Fetch dashboard data
  useEffect(() => {
    if (!selectedMerchantRef) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await api(`/api/${selectedMerchantRef}/user-dashboard`, {
          method: "GET",
        });
        setData(result.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedMerchantRef]);

  // ========================================
  // 1. ข้อมูลภาพรวมร้านของตนเอง
  // ========================================
  const storeOverview = {
    // a. จำนวนคูปอง
    coupon: {
      total: data?.myMerchantSummary?.coupon?.total || 0, // จำนวนคูปองที่ขายให้ End User
      unredeemed: data?.myMerchantSummary?.coupon?.unredeemed || 0, // i. จำนวนคูปองที่ End User ซื้อแต่ยังไม่ใช้
      redeemed: data?.myMerchantSummary?.coupon?.redeemed || 0, // ii. จำนวนคูปองที่ End User redeem แล้วจริงๆ
    },
  };

  // ========================================
  // 2. ข้อมูล End User
  // ========================================
  const endUserData = {
    // a. คน
    totalUsers: data?.myMerchantSummary?.endUser?.total || 0, // i. จำนวน End User ที่เรามี
    unredeemedUsers: data?.myMerchantSummary?.endUser?.unredeemedUsers || 0, // ii. จำนวน End User ที่ซื้อแต่ยังไม่ใช้
    redeemedUsers: data?.myMerchantSummary?.endUser?.redeemedUsers || 0, // iii. จำนวน End User ที่ redeem แล้วจริงๆ
  };

  // ========================================
  // 3. ข้อมูล Transaction Redemption
  // ========================================
  const redemptionTransactions = [
    {
      id: "TXN001",
      customerPhone: "081-234-5678",
      couponName: "ส่วนลด 100 บาท",
      couponCode: "DISC100",
      redeemedAt: "2026-01-12 14:30:22",
      status: "success",
    },
    {
      id: "TXN002",
      customerPhone: "082-345-6789",
      couponName: "ส่วนลด 50 บาท",
      couponCode: "DISC50",
      redeemedAt: "2026-01-12 13:15:45",
      status: "success",
    },
    {
      id: "TXN003",
      customerPhone: "083-456-7890",
      couponName: "แลกของรางวัล",
      couponCode: "REWARD01",
      redeemedAt: "2026-01-12 11:45:10",
      status: "success",
    },
    {
      id: "TXN004",
      customerPhone: "084-567-8901",
      couponName: "ส่วนลด 200 บาท",
      couponCode: "DISC200",
      redeemedAt: "2026-01-11 16:20:33",
      status: "success",
    },
    {
      id: "TXN005",
      customerPhone: "085-678-9012",
      couponName: "ส่วนลด 100 บาท",
      couponCode: "DISC100",
      redeemedAt: "2026-01-11 10:05:18",
      status: "success",
    },
  ];

  // Chart: คูปอง Donut
  const couponDonutOptions: ApexOptions = {
    chart: {
      type: "donut",
      background: "transparent",
    },
    labels: ["ซื้อแต่ยังไม่ใช้", "Redeem แล้ว"],
    colors: ["#9333ea", "#ec4899"], // purple-600, pink-500
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "รวมทั้งหมด",
              color: "#6b7280",
              formatter: () =>
                (
                  storeOverview.coupon.unredeemed +
                  storeOverview.coupon.redeemed
                ).toLocaleString(),
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "bottom",
      labels: {
        colors: "#6b7280",
      },
    },
    stroke: {
      show: false,
    },
    theme: {
      mode: "light",
    },
  };

  // Chart: End User Bar
  const endUserBarOptions: ApexOptions = {
    chart: {
      type: "bar",
      background: "transparent",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6,
        barHeight: "60%",
        distributed: true, // Enable different colors for each bar
      },
    },
    colors: ["#7c3aed", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899"], // Purple to Pink gradient
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "12px",
        colors: ["#fff"],
      },
      formatter: (val: number) => val.toLocaleString(),
    },
    xaxis: {
      categories: [
        "จำนวน End User ทั้งหมด",
        "ซื้อแต่ยังไม่ใช้",
        "Redeem แล้วจริงๆ",
      ],
      labels: {
        style: { colors: "#6b7280" },
      },
    },
    yaxis: {
      labels: {
        style: { colors: "#6b7280" },
      },
    },
    grid: {
      borderColor: "rgba(0,0,0,0.05)",
    },
    legend: {
      show: false,
    },
    theme: {
      mode: "light",
    },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Dashboard
          </span>
          <span className="text-gray-700"> ร้านค้า</span>
        </h1>
        
        {/* Merchant Ref Dropdown */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            เลือกร้านค้า (Merchant Ref)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <StorefrontIcon className="h-5 w-5 text-purple-500" />
            </div>
            <select
              value={selectedMerchantRef}
              onChange={(e) => setSelectedMerchantRef(e.target.value)}
              disabled={isLoadingStores}
              className="block w-full max-w-md pl-10 pr-10 py-3 text-base border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-xl bg-white shadow-sm appearance-none cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              {isLoadingStores ? (
                <option value="">กำลังโหลด...</option>
              ) : merchantRefStores.length === 0 ? (
                <option value="">ไม่พบร้านค้า</option>
              ) : (
                merchantRefStores.map((store) => (
                  <option key={store.id} value={store.merchantRef}>
                    {store.name} ({store.merchantRef})
                  </option>
                ))
              )}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================
          1. ข้อมูลภาพรวมร้านของตนเอง
          ======================================== */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></span>
          1. ข้อมูลภาพรวมร้านของตนเอง
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Coupon Section */}
          <SectionCard
            title="จำนวนคูปอง"
            icon={<ConfirmationNumberIcon className="w-5 h-5" />}
            iconColor="bg-purple-500/20 text-purple-400"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Donut Chart */}
              <div className="h-[250px]">
                <Chart
                  options={couponDonutOptions}
                  series={[
                    storeOverview.coupon.unredeemed,
                    storeOverview.coupon.redeemed,
                  ]}
                  type="donut"
                  height="100%"
                />
              </div>

              {/* Stats */}
              <div className="space-y-2">
                <StatsItem
                  label="จำนวนคูปองที่ End User ซื้อแต่ยังไม่ใช้"
                  value={storeOverview.coupon.unredeemed.toLocaleString()}
                  color="text-purple-600"
                />
                <StatsItem
                  label="จำนวนคูปองที่ End User redeem แล้ว"
                  value={storeOverview.coupon.redeemed.toLocaleString()}
                  color="text-pink-600"
                />
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-600">
                      รวมทั้งหมด
                    </p>
                    <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {(
                        storeOverview.coupon.unredeemed +
                        storeOverview.coupon.redeemed
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* ========================================
          2. ข้อมูล End User
          ======================================== */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></span>
          2. ข้อมูล End User
        </h2>

        <SectionCard
          title="ข้อมูลลูกค้า (คน)"
          icon={<PeopleIcon className="w-5 h-5" />}
          iconColor="bg-blue-500/20 text-blue-400"
        >
          <div className="space-y-6">
            {/* Stats Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <StatCard
                value={endUserData.totalUsers.toLocaleString()}
                label="i. จำนวน End User ทั้งหมด"
                color="text-blue-400"
              />
              <StatCard
                value={endUserData.unredeemedUsers.toLocaleString()}
                label="ii. ซื้อแต่ยังไม่ใช้"
                color="text-amber-400"
              />
              <StatCard
                value={endUserData.redeemedUsers.toLocaleString()}
                label="iii. Redeem แล้วจริงๆ"
                color="text-pink-400"
              />
            </div>

            {/* Bar Chart */}
            <div className="h-[300px]">
              <Chart
                options={endUserBarOptions}
                series={[
                  {
                    name: "จำนวน",
                    data: [
                      endUserData.totalUsers,
                      endUserData.unredeemedUsers,
                      endUserData.redeemedUsers,
                    ],
                  },
                ]}
                type="bar"
                height="100%"
              />
            </div>
          </div>
        </SectionCard>
      </div>

      {/* ========================================
          3. ประวัติการ Redeem คูปอง
          ======================================== */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></span>
          3. ประวัติการ Redeem คูปอง
        </h2>

        <SectionCard
          title="รายการ Transaction ล่าสุด"
          icon={<ReceiptLongIcon className="w-5 h-5" />}
          iconColor="bg-emerald-500/20 text-emerald-400"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    เบอร์โทรลูกค้า
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ชื่อคูปอง
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    รหัสคูปอง
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    วันที่ Redeem
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    สถานะ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {redemptionTransactions.map((txn) => (
                  <tr
                    key={txn.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-4 text-sm font-mono text-purple-600">
                      {txn.id}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {txn.customerPhone}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-800 font-medium">
                      {txn.couponName}
                    </td>
                    <td className="px-4 py-4 text-sm font-mono text-gray-500">
                      {txn.couponCode}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {txn.redeemedAt}
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                        <CheckCircleIcon className="w-3 h-3" />
                        สำเร็จ
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              แสดง {redemptionTransactions.length} รายการล่าสุด
            </p>
            <button className="px-4 py-2 text-sm text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-colors shadow-md shadow-purple-500/25">
              ดูทั้งหมด
            </button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
