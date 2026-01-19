"use client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface SuccessLoadingComponentProps {
  src?: string;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
}

const DEFAULT_SRC =
  "https://lottie.host/fd7ce474-806c-4692-848d-eb863e93ee1c/5GvtHd9HgN.lottie";

export const SuccessLoadingComponent = ({
  src = DEFAULT_SRC,
  loop = true,
  autoplay = true,
  className = "w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96",
}: SuccessLoadingComponentProps) => {
  return (
    <DotLottieReact
      src={src}
      loop={loop}
      autoplay={autoplay}
      className={className}
    />
  );
};

export default SuccessLoadingComponent;
