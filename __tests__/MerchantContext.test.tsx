import { renderHook } from "@testing-library/react";
import { MerchantProvider, useMerchantId } from "@/contexts/MerchantContext";

describe("MerchantContext", () => {
  it("should provide merchantId correctly to children", () => {
    const wrapper = ({ children }: any) => (
      <MerchantProvider value="central-retail">{children}</MerchantProvider>
    );

    const { result } = renderHook(() => useMerchantId(), { wrapper });

    expect(result.current).toBe("central-retail");
  });

  it("should return null when no provider is used", () => {
    const { result } = renderHook(() => useMerchantId());
    expect(result.current).toBeNull();
  });
});
