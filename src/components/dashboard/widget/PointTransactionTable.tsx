import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const columns: GridColDef<(typeof rows)[number]>[] = [
  { field: "id", headerName: "ID", width: 50, resizable: false },
  {
    field: "firstName",
    headerName: "First name",
    width: 150,
    editable: false,
    resizable: false,
  },
  {
    field: "lastName",
    headerName: "Last name",
    width: 150,
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
    field: "txType",
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

const rows = [
  {
    id: 1,
    lastName: "Snow",
    firstName: "Jon",
    txHash:
      "0xf8de28b401167e571c32d31cfc053c5e4a33e4fe9bbd90d6befc33ce22fffcea",
    txType: "EARN",
    amount: 10,
  },
  {
    id: 2,
    lastName: "Lannister",
    firstName: "Cersei",
    txHash:
      "0xf8de28b401167e571c32d31cfc053c5e4a33e4fe9bbd90d6befc33ce22fffceb",
    txType: "EARN",
    amount: 16,
  },
  {
    id: 3,
    lastName: "Lannister",
    firstName: "Jaime",
    txHash:
      "0xf8de28b401167e571c32d31cfc053c5e4a33e4fe9bbd90d6befc33ce22fffcec",
    txType: "EARN",
    amount: 11000,
  },
  {
    id: 4,
    lastName: "Stark",
    firstName: "Arya",
    txHash:
      "0xf8de28b401167e571c32d31cfc053c5e4a33e4fe9bbd90d6befc33ce22fffced",
    txType: "REDEEM",
    amount: 100,
  },
  {
    id: 5,
    lastName: "Targaryen",
    firstName: "Daenerys",
    txHash:
      "0xf8de28b401167e571c32d31cfc053c5e4a33e4fe9bbd90d6befc33ce22fffcef",
    txType: "EARN",
    amount: 11,
  },
  {
    id: 6,
    lastName: "Melisandre",
    firstName: null,
    txHash:
      "0xf8de28b401167e571c32d31cfc053c5e4a33e4fe9bbd90d6befc33ce22fffcef",
    txType: "REDEEM",
    amount: 12,
  },
  {
    id: 7,
    lastName: "Clifford",
    firstName: "Ferrara",
    txHash:
      "0xf8de28b401167e571c32d31cfc053c5e4a33e4fe9bbd90d6befc33ce22fffcasd",
    txType: "SPEND",
    amount: 12,
  },
  {
    id: 8,
    lastName: "Frances",
    firstName: "Rossini",
    txHash:
      "0xf8de28b401167e571c32d31cfc053c5e4a33e4fe9bbd90d6befc33ce22fffsaq",
    txType: "REDEEM",
    amount: 5,
  },
  {
    id: 9,
    lastName: "Roxie",
    firstName: "Harvey",
    txHash:
      "0xf8de28b401167e571c32d31cfc053c5e4a33e4fe9bbd90d6befc33ce22fffcsa",
    txType: "SPEND",
    amount: 9,
  },
];

export const PointTransactionTable = () => {
  return (
    <DataGrid
      rows={rows}
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
