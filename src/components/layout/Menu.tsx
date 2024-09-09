import * as React from "react";
import { useSidebarState, MenuProps, MenuItemLink } from "react-admin";
import { DashboardMenuItem } from "../customs/DashboardMenuItem";

import MonetizationOnIcon from "@mui/icons-material/MonetizationOnOutlined";
import StorefrontIcon from "@mui/icons-material/StorefrontOutlined";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
import LoyaltyIcon from "@mui/icons-material/LoyaltyOutlined";
import KeyIcon from "@mui/icons-material/KeyOutlined";

import SubMenu from "./SubMenu";
import { useState } from "react";

type MenuName = "menuSetting" | "menuLoyalty";

export const CustomMenu = ({ dense = false }: MenuProps) => {
  const [open] = useSidebarState();

  const [state, setState] = useState({
    menuSetting: true,
    menuLoyalty: true,
  });

  const handleToggle = (menu: MenuName) => {
    setState((state) => ({ ...state, [menu]: !state[menu] }));
  };

  const menuItemStyle = {
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
  };

  return (
    <div
      className={`transition-width ${
        open ? "w-[180px]" : "w-[40px]"
      } duration-300 ease-out h-full py-10`}
    >
      <div className="flex flex-col gap-y-3">
        <DashboardMenuItem className="font-black " />
        <MenuItemLink
          to="/merchant"
          state={{ _scrollToTop: true }}
          primaryText={"Merchants"}
          leftIcon={<StorefrontIcon />}
          className="rounded-r-xl px-3 py-3 hover:bg-[#fabe79] hover:text-white"
          dense={dense}
          sx={menuItemStyle}
        />

        <SubMenu
          handleToggle={() => handleToggle("menuLoyalty")}
          isOpen={state.menuLoyalty}
          name="Loyalty Module"
          icon={<LoyaltyIcon />}
          dense={dense}
        >
          <MenuItemLink
            to="/point"
            state={{ _scrollToTop: true }}
            primaryText={"Points"}
            leftIcon={<MonetizationOnIcon />}
            className={`${
              open ? "pl-10" : "pl-4"
            } rounded-r-xl py-3 hover:bg-[#fabe79] hover:text-white`}
            dense={dense}
            sx={menuItemStyle}
          />
        </SubMenu>

        <SubMenu
          handleToggle={() => handleToggle("menuSetting")}
          isOpen={state.menuSetting}
          name="Setting"
          icon={<SettingsOutlined />}
          dense={dense}
        >
          <MenuItemLink
            to="/api-key"
            state={{ _scrollToTop: true }}
            primaryText={"API Keys"}
            leftIcon={<KeyIcon />}
            className={`${
              open ? "pl-10" : "pl-4"
            } rounded-r-xl py-3 hover:bg-[#fabe79] hover:text-white`}
            dense={dense}
            sx={menuItemStyle}
          />
        </SubMenu>
      </div>
    </div>
  );
};
