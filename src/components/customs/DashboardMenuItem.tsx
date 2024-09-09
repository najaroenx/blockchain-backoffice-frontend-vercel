import React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { To } from "react-router";
import { useBasename } from "ra-core";
import { MenuItemLink, MenuItemLinkProps } from "react-admin";

export const DashboardMenuItem = (props: DashboardMenuItemProps) => {
  const basename = useBasename();
  const {
    leftIcon = <DashboardIcon />,
    to = `${basename}/`,
    primaryText = "ra.page.dashboard",
    ...rest
  } = props;

  return (
    <MenuItemLink
      leftIcon={leftIcon}
      to={to}
      primaryText={primaryText}
      {...rest}
      className="rounded-r-xl py-3 px-3 hover:bg-[#fabe79] hover:text-white"
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
  );
};

export interface DashboardMenuItemProps extends Omit<MenuItemLinkProps, "to"> {
  to?: To;
  /**
   * @deprecated
   */
  sidebarIsOpen?: boolean;
}
