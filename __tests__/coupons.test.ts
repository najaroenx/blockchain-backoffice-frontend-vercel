import { coupons } from "@/data/coupons";

describe("coupons data", () => {
  it("should be an array and not empty", () => {
    expect(Array.isArray(coupons)).toBe(true);
    expect(coupons.length).toBeGreaterThan(0);
  });

  it("each coupon should contain the required basic fields", () => {
    const coupon = coupons[0];
    expect(coupon).toHaveProperty("id");
    expect(coupon).toHaveProperty("name");
    expect(coupon).toHaveProperty("status");
    expect(["active", "upcoming"]).toContain(coupon.status);
    expect(coupon).toHaveProperty("merchant");
    expect(typeof coupon.pointsCost).toBe("number");
  });

  it("each coupon should have a valid start and end date", () => {
    coupons.forEach((c) => {
      expect(new Date(c.startDate).toString()).not.toBe("Invalid Date");
      expect(new Date(c.endDate).toString()).not.toBe("Invalid Date");
    });
  });

  it("valueType should match one of the allowed types", () => {
    const allowed = ["percentage", "cash", "gift", "multiplier"];
    coupons.forEach((c) => {
      expect(allowed).toContain(c.valueType);
    });
  });
});
