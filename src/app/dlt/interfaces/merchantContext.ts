import type { ReactNode } from "react";

export interface MerchantContextProps {
  merchantId: string | null;
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

export interface MerchantProviderProps {
  value: string | null;
  children: ReactNode;
}
