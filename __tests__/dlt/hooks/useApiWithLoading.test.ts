import { renderHook, act } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock next/navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock the context
const mockShowLoading = jest.fn();
const mockHideLoading = jest.fn();
const mockShowLoadingSuccess = jest.fn();
const mockShowLoadingError = jest.fn();

jest.mock("@/app/dlt/contexts/merchantContext", () => ({
  useLoading: () => ({
    showLoading: mockShowLoading,
    hideLoading: mockHideLoading,
  }),
  useLoadingSuccess: () => ({ showLoadingSuccess: mockShowLoadingSuccess }),
  useLoadingError: () => ({ showLoadingError: mockShowLoadingError }),
}));

import { useApiWithLoading } from "@/app/dlt/hooks/useApiWithLoading";

describe("useApiWithLoading Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should initialize with isExecuting false", () => {
    const { result } = renderHook(() => useApiWithLoading());
    expect(result.current.isExecuting).toBe(false);
  });

  it("should handle successful execution", async () => {
    const { result } = renderHook(() => useApiWithLoading());
    const mockFn = jest.fn().mockResolvedValue("success");

    let promise;
    await act(async () => {
      promise = result.current.execute(mockFn);
    });

    expect(result.current.isExecuting).toBe(false);
    expect(mockShowLoading).toHaveBeenCalledWith("กรุณารอสักครู่...");
    expect(mockFn).toHaveBeenCalled();
    expect(mockHideLoading).toHaveBeenCalled();
    expect(mockShowLoadingSuccess).toHaveBeenCalledWith("สำเร็จ!");
    expect(await promise).toBe("success");
  });

  it("should handle execution failure", async () => {
    const { result } = renderHook(() => useApiWithLoading());
    const error = new Error("Test error");
    const mockFn = jest.fn().mockRejectedValue(error);

    await expect(
      act(async () => {
        await result.current.execute(mockFn);
      }),
    ).rejects.toThrow("Test error");

    expect(result.current.isExecuting).toBe(false);
    expect(mockHideLoading).toHaveBeenCalled();
    expect(mockShowLoadingError).toHaveBeenCalledWith("Test error");
  });

  it("should use custom options", async () => {
    const { result } = renderHook(() => useApiWithLoading());
    const mockFn = jest.fn().mockResolvedValue("success");
    const options = {
      loadingText: "Loading...",
      successText: "Done!",
      showSuccessOnComplete: true,
    };

    await act(async () => {
      await result.current.execute(mockFn, options);
    });

    expect(mockShowLoading).toHaveBeenCalledWith("Loading...");
    expect(mockShowLoadingSuccess).toHaveBeenCalledWith("Done!");
  });

  it("should not show success message when showSuccessOnComplete is false", async () => {
    const { result } = renderHook(() => useApiWithLoading());
    const mockFn = jest.fn().mockResolvedValue("success");

    await act(async () => {
      await result.current.execute(mockFn, { showSuccessOnComplete: false });
    });

    expect(mockShowLoadingSuccess).not.toHaveBeenCalled();
  });

  it("should handle redirect on success", async () => {
    const { result } = renderHook(() => useApiWithLoading());
    const mockFn = jest.fn().mockResolvedValue("success");

    await act(async () => {
      await result.current.execute(mockFn, {
        redirectOnSuccess: "/dashboard",
        redirectDelay: 1000,
      });
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });

  it("should use custom error text for non-Error objects", async () => {
    const { result } = renderHook(() => useApiWithLoading());
    const mockFn = jest.fn().mockRejectedValue("string error");

    await expect(
      act(async () => {
        await result.current.execute(mockFn, { errorText: "Custom error" });
      }),
    ).rejects.toEqual("string error");

    expect(mockShowLoadingError).toHaveBeenCalledWith("Custom error");
  });
});
