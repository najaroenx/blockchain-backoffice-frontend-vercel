import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

export interface PointDetails {
  id?: string;
  name?: string;
  symbol?: string;
  contractAddress?: string | null;
  initialSupply?: number;
  decimal?: number;
  frameSize?: number;
  slotSize?: number | null;
  merchantId?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ShowPointDialogProps {
  onClose: () => void;
  open: boolean;
  point: PointDetails | null;
}

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex flex-col gap-1 rounded-xl bg-slate-50/80 px-4 py-3">
      <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">
        {label}
      </span>
      <span className="text-sm font-semibold text-slate-800 break-all">
        {value}
      </span>
    </div>
  );
};

export const ShowPointDialog: React.FC<ShowPointDialogProps> = (props) => {
  const { open, onClose, point } = props;

  return (
    <Dialog open={open} as="div" onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/30 duration-300 ease-out data-[closed]:opacity-0"
      />
      <div className="fixed inset-0 flex w-screen items-center justify-center px-6 md:px-10">
        <DialogPanel
          transition
          className="w-full max-w-md rounded-2xl space-y-5 bg-white px-8 py-10 duration-300 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <DialogTitle className="text-xl font-semibold text-center text-slate-900">
            Point Details
          </DialogTitle>

          <div className="flex flex-col gap-3">
            <InfoRow label="Point ID" value={point?.id} />
            <InfoRow label="Name" value={point?.name} />
            <InfoRow label="Symbol" value={point?.symbol?.toUpperCase()} />
            <InfoRow label="Merchant" value={point?.merchantId} />
            <InfoRow
              label="Contract Address"
              value={point?.contractAddress}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InfoRow label="Initial Supply" value={point?.initialSupply} />
              <InfoRow label="Decimal" value={point?.decimal} />
              <InfoRow label="Frame Size" value={point?.frameSize} />
              <InfoRow label="Slot Size" value={point?.slotSize} />
            </div>
            <InfoRow
              label="Created At"
              value={
                point?.createdAt
                  ? new Date(point.createdAt).toLocaleString()
                  : undefined
              }
            />
            <InfoRow
              label="Updated At"
              value={
                point?.updatedAt
                  ? new Date(point.updatedAt).toLocaleString()
                  : undefined
              }
            />
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg"
          >
            Close
          </button>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
