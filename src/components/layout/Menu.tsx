import * as React from "react";
import { useSidebarState, MenuProps, MenuItemLink } from "react-admin";
import { DashboardMenuItem } from "../customs/DashboardMenuItem";

export const CustomMenu = ({ dense = false }: MenuProps) => {
  const [open] = useSidebarState();

  return (
    <div
      className={`transition-width ${
        open ? "w-[180px]" : "w-[40px]"
      } duration-300 ease-out h-full py-10`}
    >
      <div className="flex flex-col  gap-y-5">
        <DashboardMenuItem className="font-black" />
      </div>
    </div>
  );
};
