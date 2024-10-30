import { ListBase } from "react-admin";
import { ListActions } from "../customs/ListAction";
import { GridList } from "./GridList";

const VoucherList = () => {
  return (
    <div className="bg-slate-100 h-full w-full md:max-w-full">
      <div className="container mx-auto px-5 py-10">
        <div className="flex flex-col">
          <ListBase>
            <ListActions title="Vouchers" />
            <GridList />
          </ListBase>
        </div>
      </div>
    </div>
  );
};

export default VoucherList;
