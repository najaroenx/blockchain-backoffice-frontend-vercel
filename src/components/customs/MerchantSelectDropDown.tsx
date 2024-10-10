import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import * as React from "react";

interface Props {
  merchants: {
    id: string;
    name: string;
    website: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
  currentMerchant: string;
  changeMerchant: (merchantId: string) => void;
}

export const MerchantSelectDropDown: React.FC<Props> = ({
  merchants,
  currentMerchant,
  changeMerchant,
}) => {
  const handleChange = (event: SelectChangeEvent) => {
    changeMerchant(event.target.value as string);
  };

  return (
    <FormControl size="small" className="w-64 my-2">
      <InputLabel id="demo-simple-select-label" className="text-white">
        Merchant
      </InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={currentMerchant}
        label="Merchant"
        onChange={handleChange}
        className="text-white font-bold text-base rounded-lg"
        sx={{
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
          },
          "& .MuiSelect-iconOutlined": {
            color: "white",
          },
        }}
      >
        {merchants.map((m) => (
          <MenuItem value={m.id} key={m.id}>
            {m.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
