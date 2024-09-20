import * as React from "react";
import { useListContext } from "react-admin";
import { Empty } from "../layout/Empty";
import { MerchantCard } from "./MerchantCard";
import { Loading } from "../layout/Loading";

export const GridList = () => {
  const { data, isPending } = useListContext();

  if (isPending) return <Loading />;

  if (!data || data.length === 0) return <Empty isMerchant={true} />;

  return (
    <div className="flex flex-row flex-wrap py-5 gap-5 items-center">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {data.map((record) => (
          <MerchantCard
            key={record.id}
            name={record.name}
            website={record.website}
          />
        ))}
      </div>
    </div>
  );
};
