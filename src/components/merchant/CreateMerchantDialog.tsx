import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { FormControl } from "@mui/material";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import { useState } from "react";

interface CreateMerchantDialogProps {
  onCancel: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirm: (e: React.FormEvent<HTMLFormElement>) => void;
  open: boolean;
  loading?: boolean;
}

export const CreateMerchantDialog: React.FC<CreateMerchantDialogProps> = (
  props
) => {
  const { open, loading, onCancel, handleInputChange, onConfirm } = props;
  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    // Sanitize URL to prevent XSS - only allow http/https protocols
    const sanitizedUrl = url.trim();
    
    // Validate URL format if not empty
    if (sanitizedUrl && !sanitizedUrl.match(/^https?:\/\//i)) {
      setImageError(true);
      setImageLoading(false);
    } else {
      setImageError(false);
      if (sanitizedUrl) {
        setImageLoading(true);
      } else {
        setImageLoading(false);
      }
    }
    
    setImageUrl(sanitizedUrl);
    handleInputChange(e);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    
    // Limit to 10 digits
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    
    // Validate
    if (value.length > 0 && !value.startsWith("0")) {
      setPhoneError("เบอร์โทรศัพท์ต้องเริ่มต้นด้วย 0");
    } else if (value.length > 0 && value.length < 10) {
      setPhoneError("เบอร์โทรศัพท์ต้องมี 10 หลัก");
    } else {
      setPhoneError("");
    }
    
    // Update the input value
    e.target.value = value;
    handleInputChange(e);
  };

  return (
    <Dialog open={open} as="div" onClose={onCancel} className="relative z-50 ">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/30 duration-300 ease-out data-[closed]:opacity-0"
      />
      <div className="fixed inset-0 flex w-screen items-center justify-center px-10">
        <DialogPanel
          transition
          className="w-full md:w-1/2 rounded-xl space-y-4 bg-white p-10 pt-5 duration-300 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <DialogTitle className="text-lg font-bold text-center">
            Create New Merchant
          </DialogTitle>

          <form className="flex w-full flex-col gap-5" onSubmit={onConfirm}>
            <FormControl>
              <div className="flex flex-col gap-2">
                <FormLabel className="font-semibold text-black-500" htmlFor="name">Name</FormLabel>
                <TextField
                  id="name"
                  type="text"
                  name="name"
                  placeholder="DLT Merchant"
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
                <FormLabel className="font-semibold text-black-500" htmlFor="website">Website</FormLabel>
                <TextField
                  id="website"
                  type="text"
                  name="website"
                  placeholder="https://example.com"
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
                <FormLabel  className="font-semibold text-black-500" htmlFor="website">Description</FormLabel>
                <TextField
                  id="description"
                  type="text"
                  name="description"
                  placeholder="Merchant description"
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
                <FormLabel className="font-semibold text-black-500" htmlFor="imageUrl">Image Url</FormLabel>
                <TextField
                  id="imageUrl"
                  type="text"
                  name="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  autoFocus
                  required
                  fullWidth
                  size="small"
                  variant="outlined"
                  onChange={handleImageUrlChange}
                  disabled={loading}
                  error={imageError}
                  helperText={imageError ? "ไม่สามารถโหลดรูปภาพได้ กรุณาตรวจสอบ URL" : ""}
                />
                {imageUrl && (
                  <div className="mt-2 border rounded-lg p-2 bg-gray-50">
                    <div className="relative w-full h-40">
                      {imageLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF8901]"></div>
                        </div>
                      )}
                      {imageError && (
                        <div className="absolute inset-0 flex items-center justify-center text-red-500 z-10">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      )}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover rounded"
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                        style={{ display: imageError ? 'none' : 'block' }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </FormControl>
            <FormControl>
              <div className="flex flex-col gap-2">
                <FormLabel className="font-semibold text-black-500" htmlFor="website">Location</FormLabel>
                <TextField
                  id="location"
                  type="text"
                  name="location"
                  placeholder="Location"
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
                <FormLabel className="font-semibold text-black-500" htmlFor="tel">Phone</FormLabel>
                <TextField
                  id="tel"
                  type="tel"
                  name="tel"
                  placeholder="0x-xxxx-xxxx"
                  autoFocus
                  required
                  fullWidth 
                  size="small"
                  variant="outlined"
                  onChange={handlePhoneChange}
                  disabled={loading}
                  error={!!phoneError}
                  helperText={phoneError || ""}
                  inputProps={{ 
                    maxLength: 10,
                    pattern: "0[0-9]{9}"
                  }}
                />
              </div>
            </FormControl>
            <div className="w-full flex flex-col md:flex-row justify-between gap-4">
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg shadow-gray-900/10 hover:shadow-gray-900/20 focus:opacity-[0.85] active:opacity-[0.85] active:shadow-none block w-full hover:bg-[#fbbf7a] hover:text-white text-[#FF8901] shadow-none order-2 md:order-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg shadow-gray-900/10 hover:shadow-gray-900/20 focus:opacity-[0.85] active:opacity-[0.85] active:shadow-none block w-full bg-[#FF8901] hover:bg-[#fbbf7a] text-white shadow-none order-1	md:order-2"
              >
                Save
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
