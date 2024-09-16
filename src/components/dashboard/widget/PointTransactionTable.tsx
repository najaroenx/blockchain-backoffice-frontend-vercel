import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Transaction } from "../types/transaction.type";

const columns: GridColDef<Transaction>[] = [
  { field: "id", headerName: "ID", width: 250, resizable: false },
  {
    field: "email",
    headerName: "Email",
    width: 150,
    editable: false,
    resizable: false,
  },
  {
    field: "receiverAddress",
    headerName: "Receiver address",
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
];

interface Props {
  transactions: Transaction[] | [] | undefined;
}

export const PointTransactionTable: React.FC<Props> = ({ transactions }) => {
  console.log(transactions);

  return (
    <DataGrid
      rows={transactions}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 10,
          },
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
