"use client";

import { useState, useCallback } from "react";
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
  const [isExecuting, setIsExecuting] = useState(false);
  const { showLoading, hideLoading } = useLoading();
  const { showLoadingSuccess } = useLoadingSuccess();
  const { showLoadingError } = useLoadingError();

  const execute = useCallback(
    async <T>(
      asyncFn: () => Promise<T>,
      options?: UseApiOptions
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

        // Handle redirect on success
        if (opts.redirectOnSuccess) {
          setTimeout(() => {
            window.location.href = opts.redirectOnSuccess!;
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

        throw error;
      } finally {
        setIsExecuting(false);
      }
    },
    [showLoading, hideLoading, showLoadingSuccess, showLoadingError]
  );

  return {
    execute,
    isExecuting,
  };
}

export default useApiWithLoading;
