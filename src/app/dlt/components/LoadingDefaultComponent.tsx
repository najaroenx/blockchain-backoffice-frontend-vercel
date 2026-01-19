"use client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface LoadingDefaultComponentProps {
  src?: string;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
}

const DEFAULT_SRC =
  "https://lottie.host/ac49d0d4-5282-4a60-b01c-c1368f235261/mvvqWaA7Wq.lottie";

export const LoadingDefaultComponent = ({
  src = DEFAULT_SRC,
  loop = true,
  autoplay = true,
  className = "w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96",
}: LoadingDefaultComponentProps) => {
  return (
    <DotLottieReact
      src={src}
      loop={loop}
      autoplay={autoplay}
      className={className}
    />
  );
};

export default LoadingDefaultComponent;
