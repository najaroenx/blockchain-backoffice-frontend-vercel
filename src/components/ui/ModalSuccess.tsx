import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import CheckIcon from "@mui/icons-material/Check";

interface ModalSuccessProps {
  isOpen: boolean;
  title?: string;
  description: string;
  onClose: () => void;
}

export const ModalSuccess: React.FC<ModalSuccessProps> = ({
  isOpen,
  title = "Success",
  description,
  onClose,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Optional: Auto-close after a few seconds if desired, but for now we'll stick to manual close

    if (isOpen) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }

    return () => {};
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 sm:pt-20">
      {/* Invisible backdrop to catch clicks for closing */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 flex gap-4 items-start animate-in slide-in-from-top-4 fade-in duration-300 border border-slate-100">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center mt-0.5">
          <CheckIcon className="text-white w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-800 leading-none mb-2">
            {title}
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
};
