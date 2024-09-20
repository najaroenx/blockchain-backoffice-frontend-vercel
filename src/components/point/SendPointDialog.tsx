import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { FormControl } from "@mui/material";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";

interface SendPointDialogProps {
  onCancel: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirm: (e: React.FormEvent<HTMLFormElement>) => void;
  open: boolean;
  loading?: boolean;
}

export const SendPointDialog: React.FC<SendPointDialogProps> = (props) => {
  const { open, loading, onCancel, handleInputChange, onConfirm } = props;

  return (
    <Dialog open={open} as="div" onClose={onCancel} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/30 duration-300 ease-out data-[closed]:opacity-0"
      />
      <div className="fixed inset-0 flex w-screen items-center justify-center">
        <DialogPanel
          transition
          className="w-1/4 rounded-xl space-y-4 bg-white p-10 pt-5 duration-300 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <DialogTitle className="text-lg font-bold text-center">
            Send Point
          </DialogTitle>

          <form className="flex w-full flex-col gap-5" onSubmit={onConfirm}>
            <FormControl>
              <div className="flex flex-col gap-2">
                <FormLabel htmlFor="to">To Address</FormLabel>
                <TextField
                  id="to"
                  type="text"
                  name="to"
                  placeholder="0x00000000000000"
                  autoFocus
                  required
                  fullWidth
                  size="small"
                  variant="outlined"
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
            </FormControl>
            <FormControl>
              <div className="flex flex-col gap-2">
                <FormLabel htmlFor="amount">Amount</FormLabel>
                <TextField
                  name="amount"
                  placeholder="1000000000000"
                  type="text"
                  id="amount"
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                  size="small"
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
            </FormControl>
            <div className="w-full flex justify-between gap-4">
              <button
                onClick={onCancel}
                disabled={loading}
                className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg shadow-gray-900/10 hover:shadow-gray-900/20 focus:opacity-[0.85] active:opacity-[0.85] active:shadow-none block w-full hover:bg-[#fbbf7a] hover:text-white text-[#FF8901] shadow-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg shadow-gray-900/10 hover:shadow-gray-900/20 focus:opacity-[0.85] active:opacity-[0.85] active:shadow-none block w-full bg-[#FF8901] hover:bg-[#fbbf7a] text-white shadow-none"
              >
                Send Transaction
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
