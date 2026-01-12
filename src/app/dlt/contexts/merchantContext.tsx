"use client";
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  ReactNode,
} from "react";

interface MerchantContextProps {
  merchantId: string | null;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  // Loading state
  isLoading: boolean;
  loadingText: string;
  showLoading: (text?: string) => void;
  hideLoading: () => void;
}

const MerchantContext = createContext<MerchantContextProps | undefined>(
  undefined
);

interface MerchantProviderProps {
  value: string | null;
  children: ReactNode;
}

// Minimum time to show loading (ms)
const MIN_LOADING_TIME = 500;

export const MerchantProvider = ({
  value,
  children,
}: MerchantProviderProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("กรุณารอสักครู่...");

  // Track when loading started
  const loadingStartTime = useRef<number>(0);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  return (
    <MerchantContext.Provider
      value={{
        merchantId: value,
        isSidebarCollapsed,
        toggleSidebar,
        isLoading,
        loadingText,
        showLoading,
        hideLoading,
      }}
    >
      {children}

      {/* Global Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-200">
          <div className="flex flex-col items-center gap-4">
            {/* Spinner */}
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-500/30 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
            </div>
            {/* Loading Text */}
            <div className="text-center">
              <p className="text-white font-semibold text-lg">{loadingText}</p>
              <p className="text-gray-400 text-sm mt-1">Please wait</p>
            </div>
          </div>
        </div>
      )}
    </MerchantContext.Provider>
  );
};

export const useMerchantContext = () => {
  const context = useContext(MerchantContext);
  if (!context) {
    throw new Error(
      "useMerchantContext must be used within a MerchantProvider"
    );
  }
  return context;
};

export const useMerchantId = () => {
  const context = useMerchantContext();
  return context.merchantId;
};

// Hook สำหรับใช้ loading
export const useLoading = () => {
  const context = useMerchantContext();
  return {
    isLoading: context.isLoading,
    showLoading: context.showLoading,
    hideLoading: context.hideLoading,
  };
};
