import { GridList } from "./GridList";
import { TopToolbar, CreateButton, ListBase } from "react-admin";

const MerchantList = () => {
  const MerchantActions = () => (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-2xl text-[#1C2A53]">Merchants</h1>
        <TopToolbar className="bg-slate-100">
          <CreateButton className="py-3 px-2 text-white bg-[#FF8901] hover:bg-[#fbbf7a]" />
        </TopToolbar>
      </div>
      <hr className="border-slate-200 border-2" />
    </div>
  );

  return (
    <div className="bg-slate-100 h-full w-full md:max-w-full">
      <div className="container mx-auto px-5 py-10">
        <div className="flex flex-col">
          {/* <ListBase perPage={24} sort={{ field: "reference", order: "ASC" }}> */}
          <ListBase>
            <MerchantActions />
            <GridList />
          </ListBase>
        </div>
      </div>
    </div>
  );
};

export default MerchantList;
