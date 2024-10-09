import { ListBase, ListProps, Pagination } from "react-admin";
import { DataGrid } from "./DataGrid";
import { ListActions } from "../customs/ListAction";

export const ApiKeyList = (props: ListProps) => (
  <div className="bg-slate-100 h-full w-full md:max-w-full">
    <div className="container mx-auto px-5 py-10">
      <ListBase>
        <ListActions title="API-Keys" />
        <DataGrid />
        <Pagination />
      </ListBase>
    </div>
  </div>
);
