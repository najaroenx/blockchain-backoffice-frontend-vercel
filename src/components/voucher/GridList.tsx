import * as React from "react";
import { useListContext, RecordContextProvider } from "react-admin";
import { CollectionCard } from "./CollectionCard";
import { Empty } from "../layout/Empty";
import { Loading } from "../layout/Loading";

export const GridList = () => {
  //   const { data, isPending } = useListContext();

  //   if (isPending) return <Loading />;

  //   if (!data || data.length === 0) return <Empty isMerchant={false} />;

  return (
    <div className="flex flex-row flex-wrap py-5 items-center">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
        <CollectionCard />
        <CollectionCard />
        <CollectionCard />
        <CollectionCard />
        <CollectionCard />
        <CollectionCard />
        <CollectionCard />
        <CollectionCard />
        {/* {data.map((record) => (
          <RecordContextProvider key={record.id} value={record}>
            <PointCard
              id={record.id}
              key={record.id}
              name={record.name}
              contractAddress={record.contractAddress}
            />
          </RecordContextProvider>
        ))} */}
      </div>
    </div>
  );
};
