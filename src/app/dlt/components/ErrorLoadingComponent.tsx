"use client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface ErrorLoadingComponentProps {
  src?: string;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
}

const DEFAULT_SRC =
  "https://lottie.host/98b115dc-35c3-49c3-a9d5-c6e75ea27ecf/x2ZQN8rqFL.lottie";

export const ErrorLoadingComponent = ({
  src = DEFAULT_SRC,
  loop = true,
  autoplay = true,
  className = "w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96",
}: ErrorLoadingComponentProps) => {
  return (
    <DotLottieReact
      src={src}
      loop={loop}
      autoplay={autoplay}
      className={className}
    />
  );
};

export default ErrorLoadingComponent;
