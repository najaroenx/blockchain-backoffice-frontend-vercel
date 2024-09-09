import * as React from "react";
import { TextField, useListContext, Datagrid } from "react-admin";
import { Empty } from "../layout/Empty";

export const DataGrid = () => {
  const { isPending } = useListContext();
  return isPending ? null : <LoadedDataGrid />;
};

const LoadedDataGrid = () => {
  const { data } = useListContext();

  if (!data || data.length === 0) return <Empty />;

  return (
    <div className="px-5 py-5 bg-white rounded-lg shadow-lg">
      <Datagrid bulkActionButtons={false}>
        <TextField source="name" label="Name" />
      </Datagrid>
    </div>
  );
};
