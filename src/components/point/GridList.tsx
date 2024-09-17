import * as React from "react";
import { Loading, useListContext, RecordContextProvider } from "react-admin";
import { PointCard } from "./PointCard";
import { Empty } from "../layout/Empty";

export const GridList = () => {
  const { isPending } = useListContext();
  return isPending ? <Loading /> : <LoadedGridList />;
};

const LoadedGridList = () => {
  const { data } = useListContext();

  if (!data || data.length === 0) return <Empty />;

  return (
    <div className="flex flex-row flex-wrap py-5 gap-3 items-center">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {data.map((record) => (
          <RecordContextProvider key={record.id} value={record}>
            <PointCard
              id={record.id}
              key={record.id}
              name={record.name}
              contractAddress={record.contractAddress}
            />
          </RecordContextProvider>
        ))}
      </div>
    </div>
  );
};
