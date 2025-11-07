import { merchantContacts } from "@/data/merchantContacts";

describe("merchantContacts data", () => {
  it("should be an array and not empty", () => {
    expect(Array.isArray(merchantContacts)).toBe(true);
    expect(merchantContacts.length).toBeGreaterThan(0);
  });

  it("every contact should have required fields", () => {
    merchantContacts.forEach((mc) => {
      expect(mc).toHaveProperty("name");
      expect(mc).toHaveProperty("contact");
      expect(mc).toHaveProperty("role");
      expect(mc).toHaveProperty("phone");
      expect(mc).toHaveProperty("email");
      expect(mc).toHaveProperty("accountManager");
      expect(mc).toHaveProperty("lastInteraction");
    });
  });

  it("email of each merchant contact should contain @", () => {
    merchantContacts.forEach((mc) => {
      expect(mc.email).toContain("@");
    });
  });

  it("imageUrl field should be optional but valid when exists", () => {
    merchantContacts.forEach((mc) => {
      if (mc.imageUrl) {
        expect(typeof mc.imageUrl).toBe("string");
        expect(mc.imageUrl.startsWith("http")).toBe(true);
      }
    });
  });
});
