import * as React from "react";
import { RecordContextProvider, useListContext } from "react-admin";
import { useMemo } from "react";

import { CollectionCard } from "./CollectionCard";
import { Empty } from "../layout/Empty";
import { Loading } from "../layout/Loading";
import type { CouponStatus } from "@/data/coupons";

type GridListProps = {
  records?: any[];
  isLoading?: boolean;
  statusFilter?: "all" | CouponStatus;
};

export const GridList = ({
  records,
  isLoading,
  statusFilter = "all",
}: GridListProps) => {
  const { data, isPending } = useListContext();


  const source = useMemo(() => {
    return records ?? data ?? [];
  }, [records, data]);

  const loading = isLoading ?? isPending;


  const filtered = useMemo(() => {
    if (!Array.isArray(source)) return [];
    if (statusFilter === "all") return source;
    return source.filter((record) => record.status === statusFilter);
  }, [source, statusFilter]);

  // Handle loading state
  if (loading) {
    return <Loading />;
  }

  // If no data → show Empty state
  if (!filtered || filtered.length === 0) {
    return <Empty />;
  }

  return (
    <div className="flex flex-row flex-wrap items-center gap-5 py-5">
      <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((record) => (
          <RecordContextProvider key={record.id} value={record}>
            <CollectionCard />
          </RecordContextProvider>
        ))}
      </div>
    </div>
  );
};
