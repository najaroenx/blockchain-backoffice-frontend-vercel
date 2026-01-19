"use client";
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  ReactNode,
} from "react";
import { SuccessLoadingComponent } from "@/app/dlt/components/SuccessLoadingComponent";
import LoadingDefaultComponent from "../components/LoadingDefaultComponent";
import { ErrorLoadingComponent } from "@/app/dlt/components/ErrorLoadingComponent";

interface SellerContextProps {
  sellerId: string | null;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  // Loading state
  isLoading: boolean;
  loadingText: string;
  showLoading: (text?: string) => void;
  hideLoading: () => void;
  // Success Loading state
  isLoadingSuccess: boolean;
  successText: string;
  showLoadingSuccess: (text?: string) => void;
  hideLoadingSuccess: () => void;
  // Error Loading state
  isLoadingError: boolean;
  errorText: string;
  showLoadingError: (text?: string) => void;
  hideLoadingError: () => void;
}

const SellerContext = createContext<SellerContextProps | undefined>(undefined);

interface SellerProviderProps {
  value: string | null;
  children: ReactNode;
}

// Minimum time to show loading (ms)
const MIN_LOADING_TIME = 500;
const SUCCESS_DISPLAY_TIME = 2000;
const ERROR_DISPLAY_TIME = 3000;

export const SellerProvider = ({ value, children }: SellerProviderProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("กรุณารอสักครู่...");

  // Success loading state
  const [isLoadingSuccess, setIsLoadingSuccess] = useState(false);
  const [successText, setSuccessText] = useState("สำเร็จ!");

  // Error loading state
  const [isLoadingError, setIsLoadingError] = useState(false);
  const [errorText, setErrorText] = useState("เกิดข้อผิดพลาด!");

  // Track when loading started
  const loadingStartTime = useRef<number>(0);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const showLoading = useCallback((text?: string) => {
    // Clear any pending hide timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    setLoadingText(text || "กรุณารอสักครู่...");
    setIsLoading(true);
    loadingStartTime.current = Date.now();
  }, []);

  const hideLoading = useCallback(() => {
    const elapsed = Date.now() - loadingStartTime.current;
    const remaining = MIN_LOADING_TIME - elapsed;

    if (remaining > 0) {
      // Wait for minimum time before hiding
      hideTimeoutRef.current = setTimeout(() => {
        setIsLoading(false);
        hideTimeoutRef.current = null;
      }, remaining);
    } else {
      // Already past minimum time, hide immediately
      setIsLoading(false);
    }
  }, []);

  const showLoadingSuccess = useCallback((text?: string) => {
    // Clear any pending timeout
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
      successTimeoutRef.current = null;
    }

    // Hide regular loading if showing
    setIsLoading(false);

    setSuccessText(text || "สำเร็จ!");
    setIsLoadingSuccess(true);

    // Auto hide after SUCCESS_DISPLAY_TIME
    successTimeoutRef.current = setTimeout(() => {
      setIsLoadingSuccess(false);
      successTimeoutRef.current = null;
    }, SUCCESS_DISPLAY_TIME);
  }, []);

  const hideLoadingSuccess = useCallback(() => {
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
      successTimeoutRef.current = null;
    }
    setIsLoadingSuccess(false);
  }, []);

  const showLoadingError = useCallback((text?: string) => {
    // Clear any pending timeout
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = null;
    }

    // Hide regular loading if showing
    setIsLoading(false);

    setErrorText(text || "เกิดข้อผิดพลาด!");
    setIsLoadingError(true);

    // Auto hide after ERROR_DISPLAY_TIME
    errorTimeoutRef.current = setTimeout(() => {
      setIsLoadingError(false);
      errorTimeoutRef.current = null;
    }, ERROR_DISPLAY_TIME);
  }, []);

  const hideLoadingError = useCallback(() => {
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = null;
    }
    setIsLoadingError(false);
  }, []);

  return (
    <SellerContext.Provider
      value={{
        sellerId: value,
        isSidebarCollapsed,
        toggleSidebar,
        isLoading,
        loadingText,
        showLoading,
        hideLoading,
        isLoadingSuccess,
        successText,
        showLoadingSuccess,
        hideLoadingSuccess,
        isLoadingError,
        errorText,
        showLoadingError,
        hideLoadingError,
      }}
    >
      {children}

      {/* Global Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-200">
          <div className="flex flex-col items-center gap-4">
            {/* Spinner */}
            <LoadingDefaultComponent className="w-54 h-54" />
            {/* Loading Text */}
            <div className="text-center">
              <p className="text-white font-semibold text-lg">{loadingText}</p>
              <p className="text-gray-400 text-sm mt-1">Please wait</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Loading Overlay */}
      {isLoadingSuccess && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-200">
          <div className="flex flex-col items-center gap-4">
            {/* Success Animation */}
            <SuccessLoadingComponent className="w-48 h-48" />
            {/* Success Text */}
            <div className="text-center">
              <p className="text-white font-semibold text-lg">{successText}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Loading Overlay */}
      {isLoadingError && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-200">
          <div className="flex flex-col items-center gap-4">
            {/* Error Animation */}
            <ErrorLoadingComponent className="w-48 h-48" />
            {/* Error Text */}
            <div className="text-center">
              <p className="text-white font-semibold text-lg">{errorText}</p>
            </div>
          </div>
        </div>
      )}
    </SellerContext.Provider>
  );
};

export const useSellerContext = () => {
  const context = useContext(SellerContext);
  if (!context) {
    throw new Error("useSellerContext must be used within a SellerProvider");
  }
  return context;
};

export const useSellerId = () => {
  const context = useSellerContext();
  return context.sellerId;
};

// Hook สำหรับใช้ loading
export const useSellerLoading = () => {
  const context = useSellerContext();
  return {
    isLoading: context.isLoading,
    showLoading: context.showLoading,
    hideLoading: context.hideLoading,
  };
};

// Hook สำหรับใช้ success loading
export const useSellerLoadingSuccess = () => {
  const context = useSellerContext();
  return {
    isLoadingSuccess: context.isLoadingSuccess,
    showLoadingSuccess: context.showLoadingSuccess,
    hideLoadingSuccess: context.hideLoadingSuccess,
  };
};

// Hook สำหรับใช้ error loading
export const useSellerLoadingError = () => {
  const context = useSellerContext();
  return {
    isLoadingError: context.isLoadingError,
    showLoadingError: context.showLoadingError,
    hideLoadingError: context.hideLoadingError,
  };
};
