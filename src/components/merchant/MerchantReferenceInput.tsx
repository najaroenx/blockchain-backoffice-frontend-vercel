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
> = (props) => (
  <ReferenceInput source={props.source!} reference="merchant" {...props}>
    <SelectInput
      optionText="name"
      fullWidth
      label="Select Merchant"
      validate={[required()]}
      variant="outlined"
      sx={styleTextField}
    />
  </ReferenceInput>
);

MerchantReferenceInput.defaultProps = {
  source: "merchantId",
  label: "Select Merchant",
  addLabel: true,
};

export default MerchantReferenceInput;
