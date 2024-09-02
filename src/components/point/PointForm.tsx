import { TextInput, NumberInput, required } from "react-admin";

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

export const PointForm = () => {
  return (
    <div className="flex flex-col w-full gap-5">
      <div className="flex flex-row gap-3 items-center">
        <p className="w-10 h-10 px-2 py-2 rounded-full bg-[#FF8901] text-white font-semibold text-center">
          1
        </p>
        <p className="text-[#1C2A53] font-semibold">Point Information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
        <TextInput
          source="name"
          label="Token Name"
          fullWidth
          variant="outlined"
          validate={[required()]}
          sx={styleTextField}
        />

        <TextInput
          source="symbol"
          label="Token Symbol"
          fullWidth
          variant="outlined"
          validate={[required()]}
          sx={styleTextField}
        />
        <NumberInput
          source="initialSupply"
          validate={[required()]}
          fullWidth
          onWheel={(e: any) => e.target.blur()}
          label="Initial Supply"
          variant="outlined"
          sx={styleTextField}
        />
        <NumberInput
          source="decimal"
          label="Decimal"
          validate={[required()]}
          fullWidth
          onWheel={(e: any) => e.target.blur()}
          variant="outlined"
          sx={styleTextField}
        />
      </div>

      <div className="flex flex-row gap-3 items-center">
        <p className="w-10 h-10 px-2 py-2 rounded-full bg-[#FF8901] text-white font-semibold text-center">
          2
        </p>
        <p className="text-[#1C2A53] font-semibold">Time management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
        <NumberInput
          source="frameSize"
          label="Frame Size"
          validate={[required()]}
          fullWidth
          onWheel={(e: any) => e.target.blur()}
          variant="outlined"
          sx={styleTextField}
        />

        <NumberInput
          source="slotSize"
          label="Slot Size"
          validate={[required()]}
          fullWidth
          onWheel={(e: any) => e.target.blur()}
          variant="outlined"
          sx={styleTextField}
        />
      </div>

      <hr className="border-slate-200" />
    </div>
  );
};
