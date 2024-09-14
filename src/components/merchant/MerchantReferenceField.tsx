import { FC } from "react";
import { ReferenceField, ReferenceFieldProps, TextField } from "react-admin";

const MerchantReferenceField: FC<
  Omit<ReferenceFieldProps, "reference" | "children" | "source"> & {
    source?: string;
  }
> = (props) => (
  <ReferenceField
    source={props.source!}
    reference="merchant"
    link={false}
    {...props}
  >
    <TextField source="name" label="Merchant Name" className="font-bold" />
  </ReferenceField>
);

MerchantReferenceField.defaultProps = {
  source: "merchantId",
  label: "Merchant Name",
};

export default MerchantReferenceField;
