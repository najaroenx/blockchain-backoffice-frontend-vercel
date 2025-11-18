import {
  TextInput,
  NumberInput,
  required,
  AutocompleteInput,
  FormDataConsumer,
  RadioButtonGroupInput,
  DateInput,
} from "react-admin";
import Image from "next/image";
import { DEFAULT_POINT_IMAGE } from "./constants";

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

interface Props {
  isCreate: boolean;
}

export const PointForm = ({ isCreate = true }: Props) => {
  return (
    <div className="flex flex-col w-full gap-5">
      <div className="flex flex-row gap-3 items-center">
        <p className="w-10 h-10 px-2 py-2 rounded-full bg-[#FF8901] text-white font-semibold text-center">
          1
        </p>
        <p className="text-[#1C2A53] font-semibold">Point Information</p>
      </div>

      <FormDataConsumer>
        {({ formData }) => {
          const imageUrl =
            typeof formData?.imageUrl === "string" && formData.imageUrl.length
              ? formData.imageUrl
              : DEFAULT_POINT_IMAGE;
          const tokenName =
            typeof formData?.name === "string" && formData.name.length
              ? formData.name
              : "Token Name";
          const tokenSymbol =
            typeof formData?.symbol === "string" && formData.symbol.length
              ? formData.symbol.toUpperCase()
              : "SYMBOL";
          const displaySupply =
            formData?.initialSupply !== undefined && formData.initialSupply !== ""
              ? Number(formData.initialSupply).toLocaleString("th-TH")
              : "0";

          return (
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-6 px-6 py-6">
                {/* Token Icon */}
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-slate-200 shadow-sm">
                  <Image
                    src={imageUrl}
                    alt={tokenName}
                    width={80}
                    height={80}
                    unoptimized
                    className="h-full w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = DEFAULT_POINT_IMAGE;
                    }}
                  />
                </div>

                {/* Token Information */}
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                    Token Preview
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-900">
                    {tokenName}
                  </h3>
                  <span className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600">
                    {tokenSymbol}
                  </span>
                </div>

                {/* Initial Supply */}
                <div className="flex flex-col items-end gap-1 rounded-2xl bg-slate-100 px-4 py-3 text-right">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500">
                    Initial Supply
                  </span>
                  <span className="text-sm font-semibold text-slate-700">
                    {displaySupply}
                  </span>
                </div>
              </div>
            </div>
          );
        }}
      </FormDataConsumer>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
        <TextInput
          source="name"
          label="Token Name"
          fullWidth
          variant="outlined"
          validate={[required()]}
          sx={styleTextField}
          disabled={!isCreate}
        />

        <TextInput
          source="symbol"
          label="Token Symbol"
          fullWidth
          variant="outlined"
          validate={[required()]}
          sx={styleTextField}
          disabled={!isCreate}
        />
        <NumberInput
          source="initialSupply"
          validate={[required()]}
          fullWidth
          onWheel={(e: any) => e.target.blur()}
          label="Initial Supply"
          variant="outlined"
          sx={styleTextField}
          disabled={!isCreate}
          min={1}
          step={undefined}
        />
        <NumberInput
          source="decimal"
          label="Decimal"
          validate={[required()]}
          fullWidth
          onWheel={(e: any) => e.target.blur()}
          variant="outlined"
          sx={styleTextField}
          defaultValue={18}
          readOnly
        />
        <TextInput
          source="imageUrl"
          label="Token Image URL"
          fullWidth
          variant="outlined"
          sx={styleTextField}
          placeholder="https://example.com/token-cover.png"
          className="md:col-span-2"
          helperText="วาง URL ของรูปที่จะใช้เป็นหน้าปกของโทเคน"
          disabled={!isCreate}
        />
      </div>

      <div className="flex flex-row gap-3 items-center">
        <p className="w-10 h-10 px-2 py-2 rounded-full bg-[#FF8901] text-white font-semibold text-center">
          2
        </p>
        <p className="text-[#1C2A53] font-semibold">Time management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
        <div className="md:col-span-2">
          <RadioButtonGroupInput
            source="timeMode"
            label="เลือกวิธีจัดการระยะเวลา"
            choices={[
              { id: "preset", name: "เลือกระยะเวลาจากรายการ" },
              { id: "calendar", name: "กำหนดระยะเวลาด้วยปฏิทิน" },
            ]}
            optionText="name"
            optionValue="id"
            defaultValue="preset"
            row
            disabled={!isCreate}
          />
        </div>
        <FormDataConsumer>
          {({ formData }) => {
            const mode = formData?.timeMode ?? "preset";
            if (mode === "calendar") {
              return (
                <>
                  <div className="md:col-span-1">
                    <DateInput
                      source="startDate"
                      label="วันเริ่มต้น"
                      fullWidth
                      sx={styleTextField}
                      disabled={!isCreate}
                      required
                    />
                  </div>
                  <div className="md:col-span-1">
                    <DateInput
                      source="endDate"
                      label="วันสิ้นสุด"
                      fullWidth
                      sx={styleTextField}
                      disabled={!isCreate}
                      required
                    />
                  </div>
                </>
              );
            }

            return (
              <div className="md:col-span-2">
                <AutocompleteInput
                  source="frameSize"
                  label="Period Duration"
                  choices={[
                    { id: 1, name: "3 months" },
                    { id: 2, name: "6 months" },
                    { id: 4, name: "12 months" },
                    { id: 8, name: "24 months" },
                  ]}
                  variant="outlined"
                  sx={styleTextField}
                  validate={[required()]}
                  disabled={!isCreate}
                  fullWidth
                />
              </div>
            );
          }}
        </FormDataConsumer>
      </div>

      <hr className="border-slate-200" />
    </div>
  );
};
