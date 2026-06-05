import { merchants } from "@/data/merchants";

describe("merchants data", () => {
  it("should be an array and not empty", () => {
    expect(Array.isArray(merchants)).toBe(true);
    expect(merchants.length).toBeGreaterThan(0);
  });

  it("each merchant should contain required fields", () => {
    merchants.forEach((merchant) => {
      expect(merchant).toHaveProperty("id");
      expect(merchant).toHaveProperty("name");
      expect(merchant).toHaveProperty("description");
      expect(merchant).toHaveProperty("imageUrl");
      expect(merchant).toHaveProperty("points");
      expect(merchant).toHaveProperty("location");
      expect(merchant).toHaveProperty("website");
      expect(merchant).toHaveProperty("voucherIds");
    });
  });

  it("voucherIds should be an array for every merchant", () => {
    merchants.forEach((merchant) => {
      expect(Array.isArray(merchant.voucherIds)).toBe(true);
    });
  });

  it("website field should contain valid URL format", () => {
    merchants.forEach((merchant) => {
      expect(merchant.website.startsWith("http")).toBe(true);
    });
  });

  it("points should be a number and >= 0", () => {
    merchants.forEach((merchant) => {
      expect(typeof merchant.points).toBe("number");
      expect(merchant.points).toBeGreaterThanOrEqual(0);
    });
  });
});
