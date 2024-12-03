import { Toolbar, SaveButton } from "react-admin";

export const SaveToolbar = () => (
  <Toolbar className="bg-white">
    <SaveButton
      label="Save"
      className="bg-[#FF8901] hover:bg-[#fbbf7a] shadow-none text-white disabled:bg-[#fbbf7a]"
    />
  </Toolbar>
);
