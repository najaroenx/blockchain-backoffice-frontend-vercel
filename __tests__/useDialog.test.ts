import { renderHook, act } from "@testing-library/react";
import { useDialog } from "@/hooks/useDialog";

describe("useDialog Hook", () => {
  it("should initialize with open = false", () => {
    const { result } = renderHook(() => useDialog());
    const [open] = result.current;
    expect(open).toBe(false);
  });

  it("should toggle open state correctly", () => {
    const { result } = renderHook(() => useDialog());
    const [ , toggle ] = result.current;

    // ✅ toggle 1 → true
    act(() => {
      toggle();
    });
    expect(result.current[0]).toBe(true);

    // ✅ toggle 2 → false
    act(() => {
      toggle();
    });
    expect(result.current[0]).toBe(false);
  });
});
