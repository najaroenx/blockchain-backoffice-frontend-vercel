import {
  mockMerchants,
  mockPoints,
  mockApiKeys,
  mockCustomers,
  mockDashboard,
  mockTransactions,
  mockVouchers,
} from "@/data/mockAdmin"; // ← เปลี่ยน path ให้ตรงกับโปรเจคคุณ

describe("Mock Data - Basic Structure Tests", () => {
  it("mockMerchants should be a non-empty array", () => {
    expect(Array.isArray(mockMerchants)).toBe(true);
    expect(mockMerchants.length).toBeGreaterThan(0);
  });

  it("mockPoints should contain items with id, name, and contractAddress", () => {
    mockPoints.forEach((point) => {
      expect(point).toHaveProperty("id");
      expect(point).toHaveProperty("name");
      expect(point).toHaveProperty("contractAddress");
    });
  });

  it("mockApiKeys should contain valid api keys and merchantId", () => {
    mockApiKeys.forEach((key) => {
      expect(key).toHaveProperty("apiKey");
      expect(key).toHaveProperty("merchantId");
    });
  });

  it("mockCustomers should contain email, walletAddress and transactions", () => {
    mockCustomers.forEach((cust) => {
      expect(cust).toHaveProperty("email");
      expect(cust).toHaveProperty("walletAddress");
      expect(cust).toHaveProperty("transactions");
      expect(Array.isArray(cust.transactions)).toBe(true);
    });
  });

  it("mockDashboard should contain main dashboard numeric fields", () => {
    expect(mockDashboard).toHaveProperty("customerWallet");
    expect(mockDashboard).toHaveProperty("transactionsToday");
    expect(mockDashboard).toHaveProperty("totalRedeem");
  });

  it("mockTransactions should be valid array of transaction objects", () => {
    expect(Array.isArray(mockTransactions)).toBe(true);
    mockTransactions.forEach((tx) => {
      expect(tx).toHaveProperty("txHash");
      expect(tx).toHaveProperty("sender");
      expect(tx).toHaveProperty("receiver");
    });
  });

  it("mockVouchers should match vouchers dataset", () => {
    expect(Array.isArray(mockVouchers)).toBe(true);
    expect(mockVouchers.length).toBeGreaterThan(0);
  });
});
