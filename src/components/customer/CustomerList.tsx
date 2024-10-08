import { ListBase, ListProps } from "react-admin";
import { DesktopDataGrid } from "./DesktopDataGrid";
import { ListActions } from "../customs/ListAction";
import { useMediaQuery, Theme } from "@mui/material";
import MobileDataGrid from "./MobileDataGrid";

export const CustomerList = (props: ListProps) => {
  const isXsmall = useMediaQuery<Theme>((theme) =>
    theme.breakpoints.down("sm")
  );
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("md"));

  return (
    <div className="bg-slate-100 h-full w-full md:max-w-full">
      <div className="container mx-auto px-5 py-10">
        <ListBase>
          <ListActions title="Customers" />
          {isXsmall ? <MobileDataGrid /> : <DesktopDataGrid />}
        </ListBase>
      </div>
    </div>
  );
};
