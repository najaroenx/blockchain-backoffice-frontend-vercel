import { useParams } from "next/navigation";
import { ComponentWrapper } from "../layout/ComponentWrapper";
import { EditBase, SimpleForm, TextInput, required } from "react-admin";
import { SettingToolbar } from "./SettingToolBar";

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

export const SettingForm = () => {
  const { merchantId } = useParams();

  return (
    <ComponentWrapper>
      <EditBase resource="merchant" id={merchantId} redirect={false}>
        <SimpleForm toolbar={<SettingToolbar />}>
          <div className="flex flex-col w-full gap-5">
            <div className="flex flex-row gap-3 items-center">
              <p className="w-10 h-10 px-2 py-2 rounded-full bg-[#FF8901] text-white font-semibold text-center">
                1
              </p>
              <p className="text-[#1C2A53] font-semibold">
                Merchant Information
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
              <TextInput
                source="name"
                label="Merchant Name"
                fullWidth
                variant="outlined"
                validate={[required()]}
                sx={styleTextField}
              />

              <TextInput
                source="website"
                label="Website"
                fullWidth
                variant="outlined"
                validate={[required()]}
                sx={styleTextField}
              />
            </div>
          </div>
        </SimpleForm>
      </EditBase>
    </ComponentWrapper>
  );
};
