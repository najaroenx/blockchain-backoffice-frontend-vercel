import React from "react";
import { renderHook, act } from "@testing-library/react";
import {
  SelectedProductProvider,
  useSelectedProduct,
} from "@/app/dlt/contexts/selectedProductContext";

describe("SelectedProductContext", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <SelectedProductProvider>{children}</SelectedProductProvider>
  );

  const mockProduct = {
    id: "prod-1",
    name: "Product A",
    price: 100,
    merchantId: "m-1",
  } as any;

  const mockListing = {
    id: "list-1",
    price: 100,
  } as any;

  it("should initialize with null values", () => {
    const { result } = renderHook(() => useSelectedProduct(), { wrapper });

    expect(result.current.selectedProduct).toBeNull();
    expect(result.current.selectedListing).toBeNull();
  });

  it("should set selected product", () => {
    const { result } = renderHook(() => useSelectedProduct(), { wrapper });

    act(() => {
      result.current.setSelectedProduct(mockProduct);
    });

    expect(result.current.selectedProduct).toEqual(mockProduct);
  });

  it("should set selected listing", () => {
    const { result } = renderHook(() => useSelectedProduct(), { wrapper });

    act(() => {
      result.current.setSelectedListing(mockListing);
    });

    expect(result.current.selectedListing).toEqual(mockListing);
  });

  it("should clear selection", () => {
    const { result } = renderHook(() => useSelectedProduct(), { wrapper });

    act(() => {
      result.current.setSelectedProduct(mockProduct);
      result.current.setSelectedListing(mockListing);
    });

    expect(result.current.selectedProduct).toEqual(mockProduct);
    expect(result.current.selectedListing).toEqual(mockListing);

    act(() => {
      result.current.clearSelection();
    });

    expect(result.current.selectedProduct).toBeNull();
    expect(result.current.selectedListing).toBeNull();
  });

  it("should throw error when used outside provider", () => {
    const originalError = console.error;
    console.error = jest.fn();

    try {
      renderHook(() => useSelectedProduct());
    } catch (e: any) {
      expect(e.message).toBe(
        "useSelectedProduct must be used within a SelectedProductProvider",
      );
    }

    console.error = originalError;
  });
});
