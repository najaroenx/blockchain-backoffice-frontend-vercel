import { FC } from "react";
import { ReferenceField, ReferenceFieldProps, TextField } from "react-admin";

const MerchantReferenceField: FC<
  Omit<ReferenceFieldProps, "reference" | "children" | "source"> & {
    source?: string;
  }
> = ({ source = "merchantId", label = "Merchant Name", ...rest }) => (
  <ReferenceField
    source={source}
    reference="merchant"
    link={false}
    label={label}
    {...rest}
  >
    <TextField source="name" label="Merchant Name" className="font-bold" />
  </ReferenceField>
);

export default MerchantReferenceField;
