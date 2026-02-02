import { useRef, useEffect } from "react";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  autoFocus?: boolean;
}

const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChange,
  length = 6,
  autoFocus = false,
}) => {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (autoFocus && inputs.current[0]) {
      inputs.current[0].focus();
    }
  }, [autoFocus]);

  const processInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number,
  ) => {
    const val = e.target.value;
    if (/[^0-9]/.test(val)) return; // Allow only numbers

    const newValue = value.split("");
    // Handle paste or single char
    if (val.length > 1) {
      const chars = val.slice(0, length).split("");
      onChange(chars.join(""));
      inputs.current[Math.min(chars.length, length - 1)]?.focus();
      return;
    }

    newValue[idx] = val;
    const finalValue = newValue.join("").slice(0, length);
    onChange(finalValue);

    if (val && idx < length - 1) {
      inputs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number,
  ) => {
    if (e.key === "Backspace") {
      if (!value[idx] && idx > 0) {
        // If current is empty, move back and delete previous
        const newValue = value.split("");
        newValue[idx - 1] = "";
        onChange(newValue.join(""));
        inputs.current[idx - 1]?.focus();
      } else {
        // Delete current
        const newValue = value.split("");
        newValue[idx] = "";
        onChange(newValue.join(""));
      }
    }
  };

  return (
    <div className="flex gap-3 justify-center">
      {Array.from({ length }).map((_, idx) => (
        <div
          key={idx}
          className="relative w-6 h-6 flex items-center justify-center"
        >
          <input
            ref={(el) => {
              inputs.current[idx] = el;
            }} // Fixed: Void assignment
            type="tel"
            maxLength={1} // Changed to 1 for standard behavior, handled logic in onChange
            value={value[idx] || ""}
            onChange={(e) => processInput(e, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className="absolute inset-0 w-full h-full text-center text-md font-semibold text-gray-700 bg-transparent border-none outline-none z-10 focus:ring-0"
            // Note: In a real implementation, you'd want proper focus rings or border handling here
          />
          {/* Background/Placeholder styling */}
          <div
            className={`absolute inset-0 rounded-full transition-colors pointer-events-none ${
              value[idx]
                ? //   ? "bg-transparent border-2 border-[#16C23C]"
                  "bg-transparent border-2"
                : "bg-[#D9D9D9]"
            }`}
          ></div>
          {/* If you want the dot style when empty like original: */}
          {/* {!value[idx] && <div className="absolute w-4 h-4 bg-[#D9D9D9] rounded-full pointer-events-none" />} */}
        </div>
      ))}
    </div>
  );
};
export default OtpInput;
