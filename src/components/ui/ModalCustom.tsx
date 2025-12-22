import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ModalCustomProps {
  isOpen: boolean;
  title: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  children: React.ReactNode;
}

export const ModalCustom: React.FC<ModalCustomProps> = ({
  isOpen,
  title,
  children,
  confirmText = "Okay",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Prevent scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity"
        onClick={onCancel ? onCancel : () => {}}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6 transform transition-all animate-in fade-in zoom-in-95 duration-200">
        <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
        {children && <>{children}</>}
        <div className="flex items-center justify-end gap-3">
          {onCancel ? (
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors"
            >
              {cancelText}
            </button>
          ) : null}
          {onConfirm ? (
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-200 transition-colors"
            >
              {confirmText}
            </button>
          ) : null}
        </div>
      </div>
    </div>,
    document.body
  );
};
