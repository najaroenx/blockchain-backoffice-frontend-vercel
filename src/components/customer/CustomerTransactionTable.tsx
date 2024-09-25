import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Transaction } from "./types/transaction.type";
import moment from "moment";
import { ShowProps, useRecordContext } from "react-admin";

const columns: GridColDef<Transaction>[] = [
  {
    field: "senderAddress",
    headerName: "Sender Address",
    width: 400,
    editable: false,
    resizable: false,
  },
  {
    field: "receiverAddress",
    headerName: "Receiver Address",
    width: 400,
    editable: false,
    resizable: false,
  },
  {
    field: "txHash",
    headerName: "Transaction ID",
    type: "string",
    width: 550,
    editable: false,
    resizable: false,
  },
  {
    field: "transactionTypeId",
    headerName: "Type",
    type: "string",
    width: 90,
    editable: false,
    resizable: false,
  },
  {
    field: "amount",
    headerName: "Amount",
    type: "number",
    width: 110,
    editable: false,
    resizable: false,
  },
  {
    field: "createdAt",
    headerName: "Date",
    valueFormatter: (params: any) =>
      moment(new Date(params)).format("DD/MM/YYYY"),
    width: 110,
    editable: false,
    resizable: false,
  },
];

export const CustomerTransactionTable: React.FC<any> = () => {
  const record = useRecordContext();

  return (
    <DataGrid
      rows={record?.transaction}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 10,
          },
        },
        sorting: {
          sortModel: [{ field: "createdAt", sort: "desc" }],
        },
      }}
      pageSizeOptions={[10]}
      disableRowSelectionOnClick
      sx={{
        "& .MuiDataGrid-columnSeparator:not(.MuiDataGrid-columnSeparator--resizable)":
          {
            display: "none !important",
          },
        maxWidth: { md: "1100px", xl: "1440px" },
      }}
    />
  );
};
