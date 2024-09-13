import { TextInput, NumberInput, required } from "react-admin";
import MerchantReferenceInput from "../merchant/MerchantReferenceInput";

const styleTextField = {
  "& .MuiOutlinedInput-root": {
    borderColor: "#FF8901",
    "&.Mui-focused": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#FF8901",
      },
    },
    "&:hover:not(.Mui-focused)": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#FF8901",
      },
    },
  },
};

export const ApiKeyForm = () => {
  return (
    <div className="flex flex-col w-full gap-5">
      <div className="flex flex-row gap-3 items-center">
        <p className="w-10 h-10 px-2 py-2 rounded-full bg-[#FF8901] text-white font-semibold text-center">
          1
        </p>
        <p className="text-[#1C2A53] font-semibold">Api Key Information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
        <TextInput
          source="name"
          label="Api Key Name"
          fullWidth
          variant="outlined"
          validate={[required()]}
          sx={styleTextField}
        />

        <TextInput
          source="website"
          label="Api Key Description"
          fullWidth
          variant="outlined"
          sx={styleTextField}
        />
      </div>

      <hr className="border-slate-200" />
    </div>
  );
};
