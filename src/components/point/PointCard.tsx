import {
  EditButton,
  ShowButton,
  useNotify,
  useRecordContext,
} from "react-admin";
import { SendPointDialog } from "./SendPointDialog";
import { useCallback, useState } from "react";
import { useDialog } from "@/hooks/useDialog";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { api } from "@/libs/api";

interface Props {
  id: string;
  name: string;
  contractAddress: string;
}

type FormValues = {
  email: string;
  amount: string;
};

export const PointCard: React.FC<Props> = ({ name, contractAddress, id }) => {
  const [open, handleOpen, handleClose] = useDialog();

  const notify = useNotify();

  const record = useRecordContext();

  const merchantId = localStorage.getItem("RaStore.currentMerchant");

  const cleanedMerchantId = merchantId ? merchantId.replace(/"/g, "") : "";

  const [formValues, setFormValues] = useState<FormValues>({
    email: "",
    amount: "",
  });

  const mutation = useMutation({
    mutationFn: async () => {
      return api(`/api/point/${record?.id}`, {
        method: "POST",
        body: {
          email: formValues.email,
          amount: formValues.amount,
        },
        headers: {
          "Merchant-Id": cleanedMerchantId,
        },
      });
    },
    onSuccess: () => {
      notify("Send transaction success", { type: "success" });
      handleClose();
    },
  });

  const handleClick = useCallback(() => {
    handleOpen();
  }, [handleOpen]);

  const handleConfirm = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (mutation.isPending) return;
      mutation.mutate();
    },
    [mutation]
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg max-w-md shadow-lg">
      <div className="relative w-full h-48">
        <Image
          src="https://raw.seadn.io/files/5989b6c83f9e0457bb6f4e962cd225f5.png"
          alt="Mythic Seed"
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent opacity-80 rounded-lg"></div>
      </div>

      <div className="pt-4">
        <div className="flex items-center space-x-2">
          <h2 className="font-semibold text-lg">{name}</h2>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-blue-500"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M12 2a10 10 0 0110 10v10H2V12A10 10 0 0112 2zm5.707 7.293a1 1 0 00-1.414 0L10 15.586l-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </div>

        <p className="block font-sans text-sm font-normal text-gray-700 opacity-75 overflow-hidden text-ellipsis whitespace-nowrap">
          ID : {id}
        </p>

        <div className="flex flex-col md:flex-row mt-5 gap-2 pt-0 ">
          <EditButton
            label="Edit Point"
            className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg shadow-gray-900/10 hover:shadow-gray-900/20 focus:opacity-[0.85] active:opacity-[0.85] active:shadow-none block w-full hover:bg-[#fbbf7a] hover:text-white text-[#FF8901] shadow-none"
          />

          {/* <ShowButton
            label="Show Point"
            className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg shadow-gray-900/10 hover:shadow-gray-900/20 focus:opacity-[0.85] active:opacity-[0.85] active:shadow-none block w-full hover:bg-[#fbbf7a] hover:text-white text-[#FF8901] shadow-none"
          /> */}

          <button
            onClick={handleClick}
            className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg shadow-gray-900/10 hover:shadow-gray-900/20 focus:opacity-[0.85] active:opacity-[0.85] active:shadow-none block w-full bg-[#FF8901] hover:bg-[#fbbf7a] text-white shadow-none"
          >
            Send Point
          </button>
        </div>
        <SendPointDialog
          open={open}
          onCancel={handleClose}
          onConfirm={handleConfirm}
          handleInputChange={handleInputChange}
          loading={mutation.isPending}
        />
      </div>
    </div>
  );
};
