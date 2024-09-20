import { GridList } from "./GridList";
import { ListBase } from "react-admin";
import { ListActions } from "../customs/ListAction";

const PointList = () => {
  return (
    <div className="bg-slate-100 h-full w-full md:max-w-full">
      <div className="container mx-auto px-5 py-10">
        <div className="flex flex-col">
          {/* <ListBase perPage={24} sort={{ field: "reference", order: "ASC" }}> */}
          <ListBase>
            <ListActions title="Points" />
            <GridList />
          </ListBase>
        </div>
      </div>
    </div>
  );
};

export default PointList;
