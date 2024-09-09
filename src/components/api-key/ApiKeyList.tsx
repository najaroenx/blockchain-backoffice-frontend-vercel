import { CreateButton, ListBase, ListProps, TopToolbar } from "react-admin";
import { DataGrid } from "./DataGrid";

const ApiKeyActions = () => (
  <div className="flex flex-col gap-1 w-full mb-5">
    <div className="flex items-center justify-between">
      <h1 className="font-medium text-2xl text-[#1C2A53] w-2/3">API Keys</h1>
      <TopToolbar className="bg-slate-100 w-1/3">
        <CreateButton className="py-3 px-2 text-white bg-[#FF8901] hover:bg-[#fbbf7a]" />
      </TopToolbar>
    </div>
    <hr className="border-slate-200 border-2" />
  </div>
);

export const ApiKeyList = (props: ListProps) => (
  <div className="bg-slate-100 h-full w-full md:max-w-full">
    <div className="container mx-auto px-5 py-10">
      <ListBase>
        <ApiKeyActions />
        <DataGrid />
      </ListBase>
    </div>
  </div>
);
