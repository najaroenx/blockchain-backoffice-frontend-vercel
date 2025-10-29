import { FC } from "react";
import {
  ReferenceInput,
  ReferenceInputProps,
  SelectInput,
  required,
} from "react-admin";

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

const MerchantReferenceInput: FC<
  Omit<ReferenceInputProps, "reference" | "children" | "source"> & {
    source?: string;
  }
> = ({ source = "merchantId", label = "Select Merchant", ...rest }) => (
  <ReferenceInput
    source={source}
    reference="merchant"
    label={label}
    {...rest}
  >
    <SelectInput
      optionText="name"
      fullWidth
      label={label}
      validate={[required()]}
      variant="outlined"
      sx={styleTextField}
    />
  </ReferenceInput>
);

export default MerchantReferenceInput;
