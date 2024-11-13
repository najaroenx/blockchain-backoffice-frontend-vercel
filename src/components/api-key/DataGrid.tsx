import * as React from "react";
import { TextField, useListContext, Datagrid, DeleteButton } from "react-admin";
import { Empty } from "../layout/Empty";
import { Loading } from "../layout/Loading";
import MerchantReferenceField from "../merchant/MerchantReferenceField";

export const DataGrid = () => {
  const { data, isPending } = useListContext();

  if (isPending) return <Loading />;

  if (!data || data.length === 0) return <Empty />;

  return (
    <div className="py-5 bg-white rounded-lg shadow-lg mt-4 overflow-x-scroll">
      <Datagrid
        bulkActionButtons={false}
        sx={{
          "& .MuiDataGrid-columnSeparator:not(.MuiDataGrid-columnSeparator--resizable)":
            {
              display: "none !important",
            },
          maxWidth: { xs: "350px", sm: "800px", md: "1100px", xl: "1440px" },
        }}
      >
        <TextField source="name" label="Name" className="font-bold" />
        <TextField
          source="description"
          label="Description"
          emptyText="-"
          className="font-bold"
        />
        <TextField source="apiKey" label="API Key" className="font-bold" />
        <MerchantReferenceField />
        <DeleteButton className="font-bold hover:bg-[#ff9393] hover:text-white text-[#fd3535] shadow-none" />
      </Datagrid>
    </div>
  );
};
