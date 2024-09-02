import * as React from "react";
import { useSidebarState, MenuProps, MenuItemLink } from "react-admin";
import { DashboardMenuItem } from "../customs/DashboardMenuItem";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

export const CustomMenu = ({ dense = false }: MenuProps) => {
  const [open] = useSidebarState();

  return (
    <div
      className={`transition-width ${
        open ? "w-[180px]" : "w-[40px]"
      } duration-300 ease-out h-full py-10`}
    >
      <div className="flex flex-col gap-y-1">
        <DashboardMenuItem className="font-black" />
        <MenuItemLink
          to="/point"
          state={{ _scrollToTop: true }}
          primaryText={"Point"}
          leftIcon={<MonetizationOnIcon />}
          className="rounded-r-xl px-3 hover:bg-[#fabe79] hover:text-white"
          dense={dense}
          sx={{
            "&.RaMenuItemLink-active": {
              color: "white",
              backgroundColor: "#FF8901",
              ":hover": {
                color: "white",
              },
              "& .RaMenuItemLink-icon": {
                color: "white",
              },
            },
            "&:hover": {
              "& .RaMenuItemLink-icon": {
                color: "white",
              },
            },
            "& .RaMenuItemLink-icon": {
              color: "black",
            },
          }}
        />
      </div>
    </div>
  );
};
