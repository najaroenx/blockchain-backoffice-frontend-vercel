import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Transaction } from "../types/transaction.type";
import moment from "moment";

const columns: GridColDef<Transaction>[] = [
  {
    field: "sender",
    headerName: "Sender",
    width: 250,
    editable: false,
    resizable: false,
    valueGetter: (value, row) => `${row.sender.emailOrWebsite || ""}`,
  },
  {
    field: "receiver",
    headerName: "Receiver",
    width: 250,
    editable: false,
    resizable: false,
    valueGetter: (value, row) => `${row.receiver.emailOrWebsite || ""}`,
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
    width: 110,
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
    width: 150,
    editable: false,
    resizable: false,
  },
];

interface Props {
  transactions: Transaction[] | [] | undefined;
}

export const PointTransactionTable: React.FC<Props> = ({ transactions }) => {
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
