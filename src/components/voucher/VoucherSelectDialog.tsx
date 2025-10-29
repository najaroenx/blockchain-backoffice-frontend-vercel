import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from "@headlessui/react";
import { VoucherSelectLayout } from "./VoucherSelectLayout";
import type { VoucherProceedPayload } from "./VoucherSelectLayout";

interface VoucherSelectDialogProps {
  open: boolean;
  onClose: () => void;
  onProceed?: (payload: VoucherProceedPayload) => void;
  merchantId?: string;
}

export const VoucherSelectDialog = ({
  open,
  onClose,
  onProceed,
  merchantId,
}: VoucherSelectDialogProps) => {
  return (
    <Dialog open={open} as="div" onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/30 backdrop-blur-sm duration-300 ease-out data-[closed]:opacity-0"
      />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-start justify-center px-4 py-10">
          <DialogPanel className="w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5">
            <VoucherSelectLayout
              showBackLink={false}
              onClose={onClose}
              onProceed={onProceed}
              merchantId={merchantId}
              className="px-8 py-10"
            />
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};
