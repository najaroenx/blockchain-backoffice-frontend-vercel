"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";

import { coupons, type Coupon, type ValueType } from "@/data/coupons";
import { dateFormatter, formatValueLabel } from "@/app/coupons/utils";

export type CouponCreatePayload = {
  name: string;
  description: string;
  merchant: string;
  valueType: ValueType;
  value: number;
  currency: string;
  pointsCost: number;
  limitPerMember: number;
  totalQuantity: number;
  startDate: string;
  endDate: string;
  categories: string[];
};

type FormState = {
  name: string;
  description: string;
  merchant: string;
  valueType: ValueType;
  value: number;
  currency: string;
  pointsCost: number;
  limitPerMember: number;
  totalQuantity: number;
  startDate: string;
  endDate: string;
  categories: string;
};

export type CouponCreateFormProps = {
  onCancel?: () => void;
  onSubmit?: (payload: CouponCreatePayload) => void;
  showPreview?: boolean;
  className?: string;
  heading?: string;
  description?: string;
};

const initialFormState: FormState = {
  name: "",
  description: "",
  merchant: "",
  valueType: "percentage",
  value: 10,
  currency: "฿",
  pointsCost: 1000,
  limitPerMember: 1,
  totalQuantity: 500,
  startDate: "",
  endDate: "",
  categories: "",
};

const mapFormToPayload = (form: FormState): CouponCreatePayload => ({
  name: form.name,
  description: form.description,
  merchant: form.merchant,
  valueType: form.valueType,
  value: form.value,
  currency: form.currency,
  pointsCost: form.pointsCost,
  limitPerMember: form.limitPerMember,
  totalQuantity: form.totalQuantity,
  startDate: form.startDate,
  endDate: form.endDate,
  categories: form.categories
    .split(",")
    .map((category) => category.trim())
    .filter(Boolean),
});

const buildPreviewCoupon = (form: FormState): Coupon => {
  const payload = mapFormToPayload(form);

  return {
    id: "PREVIEW",
    name: payload.name || "คูปองใหม่",
    description: payload.description || "รายละเอียดคูปอง",
    status: "upcoming",
    merchant: payload.merchant || "ยังไม่ระบุร้านค้า",
    valueType: payload.valueType,
    value: payload.value,
    currency: payload.currency,
    pointsCost: payload.pointsCost,
    startDate:
      payload.startDate || new Date().toISOString().slice(0, 10),
    endDate:
      payload.endDate || new Date().toISOString().slice(0, 10),
    totalIssued: payload.totalQuantity,
    totalRedeemed: 0,
    limitPerMember: payload.limitPerMember,
    categories: payload.categories,
  };
};

const CouponCreateForm = ({
  onCancel,
  onSubmit,
  showPreview = true,
  className,
  heading,
  description,
}: CouponCreateFormProps) => {
  const [form, setForm] = useState<FormState>(initialFormState);

  const suggestedMerchants = useMemo(
    () => Array.from(new Set(coupons.map((coupon) => coupon.merchant))),
    []
  );

  const previewCoupon = useMemo(() => buildPreviewCoupon(form), [form]);
  const previewDateRange =
    form.startDate && form.endDate
      ? `${dateFormatter.format(new Date(form.startDate))} – ${dateFormatter.format(
          new Date(form.endDate)
        )}`
      : "ยังไม่กำหนด";

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "value" ||
        name === "pointsCost" ||
        name === "limitPerMember" ||
        name === "totalQuantity"
          ? Number(value)
          : value,
    }));
  };

  const handleReset = () => setForm(initialFormState);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = mapFormToPayload(form);
    if (onSubmit) {
      onSubmit(payload);
    } else {
      console.log("Create coupon payload:", payload);
    }
  };

  const isCurrencyEditable =
    form.valueType === "cash" || form.valueType === "gift";

  const renderForm = () => (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      {(heading || description) && (
        <div className="space-y-1">
          {heading && (
            <h2 className="text-lg font-semibold text-slate-900">{heading}</h2>
          )}
          {description && (
            <p className="text-sm text-slate-600">{description}</p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-semibold text-slate-700">
          ชื่อคูปอง
        </label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="เช่น ส่วนลด 20% สมาชิกใหม่"
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
          required
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="description"
          className="text-sm font-semibold text-slate-700"
        >
          รายละเอียดคูปอง
        </label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          placeholder="สรุปรายละเอียด สิทธิประโยชน์ และเงื่อนไขสำคัญ"
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="merchant"
            className="text-sm font-semibold text-slate-700"
          >
            ร้านค้า
          </label>
          <input
            id="merchant"
            name="merchant"
            list="merchant-suggestions"
            value={form.merchant}
            onChange={handleChange}
            placeholder="ชื่อร้านค้า"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
            required
          />
          <datalist id="merchant-suggestions">
            {suggestedMerchants.map((merchant) => (
              <option key={merchant} value={merchant} />
            ))}
          </datalist>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="categories"
            className="text-sm font-semibold text-slate-700"
          >
            หมวดหมู่
          </label>
          <input
            id="categories"
            name="categories"
            value={form.categories}
            onChange={handleChange}
            placeholder="ใส่คอมม่าคั่น เช่น ไลฟ์สไตล์, ร้านอาหาร"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <label
            htmlFor="valueType"
            className="text-sm font-semibold text-slate-700"
          >
            ประเภทสิทธิประโยชน์
          </label>
          <select
            id="valueType"
            name="valueType"
            value={form.valueType}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <option value="percentage">ส่วนลด (%)</option>
            <option value="cash">คูปองเงินสด</option>
            <option value="gift">ของสมนาคุณ</option>
            <option value="multiplier">เพิ่มคะแนน</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="value" className="text-sm font-semibold text-slate-700">
            มูลค่าสิทธิประโยชน์
          </label>
          <input
            id="value"
            name="value"
            type="number"
            min={0}
            value={form.value}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="currency"
            className="text-sm font-semibold text-slate-700"
          >
            สกุลเงิน
          </label>
          <input
            id="currency"
            name="currency"
            value={form.currency}
            onChange={handleChange}
            disabled={!isCurrencyEditable}
            className={[
              "w-full rounded-2xl border px-4 py-3 text-sm transition focus:outline-none focus:ring-2",
              isCurrencyEditable
                ? "border-slate-200 bg-slate-50 text-slate-700 focus:border-slate-300 focus:bg-white focus:ring-slate-200"
                : "border-dashed border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed",
            ].join(" ")}
          />
          {!isCurrencyEditable && (
            <p className="text-xs text-slate-400">
              ใช้เฉพาะคูปองเงินสดหรือของสมนาคุณ
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <label
            htmlFor="pointsCost"
            className="text-sm font-semibold text-slate-700"
          >
            คะแนนที่ต้องใช้แลก
          </label>
          <input
            id="pointsCost"
            name="pointsCost"
            type="number"
            min={0}
            value={form.pointsCost}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="totalQuantity"
            className="text-sm font-semibold text-slate-700"
          >
            จำนวนคูปองทั้งหมด
          </label>
          <input
            id="totalQuantity"
            name="totalQuantity"
            type="number"
            min={1}
            value={form.totalQuantity}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="limitPerMember"
            className="text-sm font-semibold text-slate-700"
          >
            จำกัดจำนวนต่อสมาชิก (สิทธิ์)
          </label>
          <input
            id="limitPerMember"
            name="limitPerMember"
            type="number"
            min={1}
            value={form.limitPerMember}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="startDate"
            className="text-sm font-semibold text-slate-700"
          >
            วันที่เริ่มต้น
          </label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            value={form.startDate}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="endDate"
            className="text-sm font-semibold text-slate-700"
          >
            วันที่สิ้นสุด
          </label>
          <input
            id="endDate"
            name="endDate"
            type="date"
            value={form.endDate}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
            required
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={() => {
              handleReset();
              onCancel();
            }}
            className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
          >
            ปิด
          </button>
        )}
        <button
          type="button"
          onClick={handleReset}
          className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
        >
          ล้างข้อมูล
        </button>
        <button
          type="submit"
          className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg"
        >
          สร้างคูปอง
        </button>
      </div>
    </form>
  );

  return (
    <div className={className}>
      {showPreview ? (
        <div className="grid gap-6 lg:grid-cols-[2fr_1.2fr]">
          {renderForm()}
          <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Preview
            </p>
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {previewCoupon.name}
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  {previewCoupon.description}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  มูลค่าสิทธิประโยชน์
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {formatValueLabel(previewCoupon)}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  ใช้คะแนน {previewCoupon.pointsCost.toLocaleString("th-TH")} คะแนน
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-600">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  รายละเอียดเพิ่มเติม
                </p>
                <p className="mt-2 font-medium text-slate-900">
              ร้านค้า: {previewCoupon.merchant}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              จำนวนทั้งหมด {previewCoupon.totalIssued.toLocaleString("th-TH")} สิทธิ์
            </p>
            {previewCoupon.categories.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {previewCoupon.categories.map((category) => (
                  <span
                        key={category}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                )}
                <p className="mt-3 text-xs text-slate-500">
                  ระยะเวลา: {previewDateRange}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  จำกัด {(previewCoupon.limitPerMember ?? 0).toLocaleString("th-TH")} สิทธิ์ ต่อสมาชิก
                </p>
              </div>
            </div>
          </aside>
        </div>
      ) : (
        renderForm()
      )}
    </div>
  );
};

export default CouponCreateForm;
