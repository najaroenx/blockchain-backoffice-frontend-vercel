import * as React from "react";
import { TextField, useListContext, Datagrid, ShowButton } from "react-admin";
import { Empty } from "../layout/Empty";
import { Loading } from "../layout/Loading";

export const DesktopDataGrid = () => {
  const { data, isPending } = useListContext();

  if (isPending) return <Loading />;

  if (!data || data.length === 0) return <Empty isMerchant={false} />;

  return (
    <div className="py-5 bg-white rounded-lg shadow-lg mt-4">
      <Datagrid
        bulkActionButtons={false}
        sx={{
          "& .MuiDataGrid-columnSeparator:not(.MuiDataGrid-columnSeparator--resizable)":
            {
              display: "none !important",
            },
          maxWidth: { md: "1100px", xl: "1440px" },
        }}
        className="mx-auto"
        rowClick={false}
      >
        <TextField source="email" label="Email" className="font-bold" />
        <TextField
          source="walletAddress"
          label="Wallet Address"
          emptyText="-"
          className="font-bold"
        />
        <TextField
          source="firstName"
          label="First Name"
          className="font-bold"
          emptyText="-"
        />
        <TextField
          source="lastName"
          label="Last Name"
          className="font-bold"
          emptyText="-"
        />
        <ShowButton className=" font-bold hover:bg-[#fbbf7a] hover:text-white text-[#FF8901] shadow-none" />
      </Datagrid>
    </div>
  );
};
