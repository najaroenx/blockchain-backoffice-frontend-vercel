import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Transaction } from "./types/transaction.type";
import moment from "moment";
import { ShowProps, useRecordContext } from "react-admin";

const columns: GridColDef<Transaction>[] = [
  {
    field: "sender",
    headerName: "Sender",
    width: 250,
    editable: false,
    resizable: false,
    valueGetter: (value, row) => `${row.sender || ""}`,
  },
  {
    field: "receiver",
    headerName: "Receiver",
    width: 250,
    editable: false,
    resizable: false,
    valueGetter: (value, row) => `${row.receiver || ""}`,
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
    width: 100,
    editable: false,
    resizable: false,
  },
  {
    field: "amount",
    headerName: "Amount",
    type: "number",
    width: 150,
    editable: false,
    resizable: false,
  },
  {
    field: "createdAt",
    headerName: "Date",
    valueFormatter: (params: any) =>
      moment(new Date(params)).format("DD/MM/YYYY"),
    width: 150,
    editable: false,
    resizable: false,
  },
];

export const CustomerTransactionTable: React.FC<any> = () => {
  const record = useRecordContext();

  return (
    <DataGrid
      rows={record?.transactions}
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
        maxWidth: { xs: "350px", sm: "800px", md: "1100px", xl: "1440px" },
      }}
    />
  );
};
