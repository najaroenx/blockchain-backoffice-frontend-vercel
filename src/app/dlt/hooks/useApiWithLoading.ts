"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useLoading,
  useLoadingSuccess,
  useLoadingError,
} from "@/app/dlt/contexts/merchantContext";

export interface UseApiOptions {
  loadingText?: string;
  successText?: string;
  errorText?: string;
  showSuccessOnComplete?: boolean;
  showErrorOnFail?: boolean;
  redirectOnSuccess?: string;
  redirectDelay?: number;
}

const DEFAULT_OPTIONS: UseApiOptions = {
  loadingText: "กรุณารอสักครู่...",
  successText: "สำเร็จ!",
  errorText: "เกิดข้อผิดพลาด!",
  showSuccessOnComplete: true,
  showErrorOnFail: true,
  redirectDelay: 2000,
};

export function useApiWithLoading() {
  const router = useRouter();
  const [isExecuting, setIsExecuting] = useState(false);
  const { showLoading, hideLoading } = useLoading();
  const { showLoadingSuccess } = useLoadingSuccess();
  const { showLoadingError } = useLoadingError();
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cancel any pending redirect timer when the hook unmounts
  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    };
  }, []);

  const execute = useCallback(
    async <T>(
      asyncFn: () => Promise<T>,
      options?: UseApiOptions,
    ): Promise<T | null> => {
      const opts = { ...DEFAULT_OPTIONS, ...options };

      setIsExecuting(true);
      showLoading(opts.loadingText);

      try {
        const result = await asyncFn();

        hideLoading();

        if (opts.showSuccessOnComplete) {
          showLoadingSuccess(opts.successText);
        }

        if (opts.redirectOnSuccess) {
          if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
          redirectTimerRef.current = setTimeout(() => {
            router.push(opts.redirectOnSuccess!);
          }, opts.redirectDelay);
        }

        return result;
      } catch (error) {
        hideLoading();

        if (opts.showErrorOnFail) {
          const errorMessage =
            error instanceof Error ? error.message : opts.errorText;
          showLoadingError(errorMessage);
        }

        // Return null — the error overlay already informs the user.
        // Callers check for null return instead of catching.
        return null;
      } finally {
        setIsExecuting(false);
      }
    },
    [showLoading, hideLoading, showLoadingSuccess, showLoadingError, router],
  );

  return {
    execute,
    isExecuting,
  };
}

export default useApiWithLoading;
