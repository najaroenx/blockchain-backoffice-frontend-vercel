import { ListBase, ListProps, Pagination } from "react-admin";
import { DesktopDataGrid } from "./DesktopDataGrid";
import { ListActions } from "../customs/ListAction";
import { useMediaQuery, Theme, Box } from "@mui/material";
import MobileDataGrid from "./MobileDataGrid";

export const CustomerList = (props: ListProps) => {
  const isXsmall = useMediaQuery<Theme>((theme) =>
    theme.breakpoints.down("sm")
  );
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("md"));

  return (
    <div className="bg-slate-100 h-full w-full md:max-w-full">
      <div className="container mx-auto px-5 py-10">
        <ListBase perPage={10} {...props}>
          <ListActions title="Customers" />
          {isXsmall ? <MobileDataGrid /> : <DesktopDataGrid />}
          <Pagination rowsPerPageOptions={[5, 10, 50, 100]} />
        </ListBase>
      </div>
    </div>
  );
};
