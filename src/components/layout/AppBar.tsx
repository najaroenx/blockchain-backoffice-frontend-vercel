import * as React from "react";
import { AppBar, TitlePortal } from "react-admin";

export const CustomAppBar = () => (
  <AppBar color="default" className="bg-[#FF8901] text-white">
    <TitlePortal />
  </AppBar>
);
