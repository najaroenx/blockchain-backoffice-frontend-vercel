import * as React from "react";
import { useListContext } from "react-admin";
import { PointCard } from "./PointCard";

export const GridList = () => {
  const { isPending } = useListContext();
  return isPending ? null : <LoadedGridList />;
};

const LoadedGridList = () => {
  const { data } = useListContext();

  if (!data) return null;

  return (
    <div className="flex flex-row flex-wrap py-5 gap-5 items-center">
      {data.map((record) => (
        <PointCard
          key={record.id}
          name={record.name}
          description={record.description}
        />
      ))}
    </div>
  );
};
