import { renderHook, act } from "@testing-library/react";
import { useForm } from "@/hooks/useForm";

describe("useForm Hook", () => {
  const initialValues = { name: "", website: "" };

  it("should return initial form values", () => {
    const { result } = renderHook(() => useForm(initialValues));
    expect(result.current.formValues).toEqual(initialValues);
  });

  it("should update form values when handleInputChange is called", () => {
    const { result } = renderHook(() => useForm(initialValues));

    // ✅ จำลอง event ของ input
    const mockEvent = {
      target: { name: "name", value: "John Doe" },
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleInputChange(mockEvent);
    });

    expect(result.current.formValues).toEqual({
      name: "John Doe",
      website: "",
    });
  });

  it("should allow direct setFormValues update", () => {
    const { result } = renderHook(() => useForm(initialValues));

    act(() => {
      result.current.setFormValues({ name: "Alice", website: "example.com" });
    });

    expect(result.current.formValues).toEqual({
      name: "Alice",
      website: "example.com",
    });
  });
});
