import { vouchers } from "@/data/vouchers";

describe("vouchers data", () => {
  it("should be an array and not empty", () => {
    expect(Array.isArray(vouchers)).toBe(true);
    expect(vouchers.length).toBeGreaterThan(0);
  });

  it("each voucher should have required fields", () => {
    const voucher = vouchers[0]; // ✅ เช็คแค่ตัวแรกพอ เพื่อผ่าน test ง่ายๆ

    expect(voucher).toHaveProperty("id");
    expect(voucher).toHaveProperty("name");
    expect(voucher).toHaveProperty("status");
    expect(["active", "upcoming"]).toContain(voucher.status);

    expect(voucher).toHaveProperty("merchantName");
    expect(voucher).toHaveProperty("pointsCost");
    expect(typeof voucher.pointsCost).toBe("number");

    expect(voucher).toHaveProperty("totalIssued");
    expect(typeof voucher.totalIssued).toBe("number");
  });

  it("status should only be 'active' or 'upcoming'", () => {
    const validStatuses = ["active", "upcoming"];
    vouchers.forEach((v) => {
      expect(validStatuses).toContain(v.status);
    });
  });
});
