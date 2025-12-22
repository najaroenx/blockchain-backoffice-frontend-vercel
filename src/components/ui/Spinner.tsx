import React from "react";

export interface SpinnerProps {
  /**
   * The size of the spinner.
   * @default 'md'
   */
  size?: "sm" | "md" | "lg" | "xl";
  /**
   * The color of the spinner. Pass a Tailwind text color class.
   * @default 'text-blue-600'
   */
  color?: string;
  /**
   * Additional custom classes.
   */
  className?: string;
}

const sizeConfig = {
  sm: { dimensions: "w-5 h-5", border: "border-2" },
  md: { dimensions: "w-8 h-8", border: "border-[3px]" },
  lg: { dimensions: "w-12 h-12", border: "border-4" },
  xl: { dimensions: "w-16 h-16", border: "border-[5px]" },
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  color = "text-blue-600",
  className = "",
}) => {
  const { dimensions, border } = sizeConfig[size];

  return (
    <div
      className={`relative inline-block ${dimensions} ${className}`}
      role="status"
      aria-label="Loading"
    >
      {/* Background Track - fainter version of the color */}
      <div
        className={`absolute inset-0 rounded-full ${border} border-current opacity-25 ${color}`}
      ></div>

      {/* Spinning Segment */}
      <div
        className={`absolute inset-0 rounded-full ${border} border-t-current border-r-transparent border-b-transparent border-l-transparent animate-spin ${color}`}
      ></div>

      <span className="sr-only">Loading...</span>
    </div>
  );
};
