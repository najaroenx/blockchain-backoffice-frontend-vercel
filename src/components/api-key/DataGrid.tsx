import * as React from "react";
import { TextField, useListContext, Datagrid } from "react-admin";
import { Empty } from "../layout/Empty";
import { Loading } from "../layout/Loading";

export const DataGrid = () => {
  const { isPending } = useListContext();
  return isPending ? <Loading /> : <LoadedDataGrid />;
};

const LoadedDataGrid = () => {
  const { data } = useListContext();

  if (!data || data.length === 0) return <Empty />;

  return (
    <div className="px-5 py-5 bg-white rounded-lg shadow-lg">
      <Datagrid bulkActionButtons={false}>
        <TextField source="name" label="Name" className="font-bold" />
        <TextField
          source="description"
          label="Description"
          emptyText="-"
          className="font-bold"
        />
        <TextField source="apiKey" label="API Key" className="font-bold" />
      </Datagrid>
    </div>
  );
};
