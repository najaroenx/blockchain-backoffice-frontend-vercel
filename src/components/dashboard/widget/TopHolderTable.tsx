import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const columns: GridColDef<(typeof rows)[number]>[] = [
  {
    field: "id",
    headerName: "ID",
    width: 50,
    resizable: false,
  },
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
    amount: 1000000,
  },
  {
    id: 2,
    lastName: "Lannister",
    firstName: "Cersei",
    amount: 999,
  },
  {
    id: 3,
    lastName: "Lannister",
    firstName: "Jaime",
    amount: 1234,
  },
  {
    id: 4,
    lastName: "Stark",
    firstName: "Arya",
    amount: 3344,
  },
  {
    id: 5,
    lastName: "Targaryen",
    firstName: "Daenerys",
    amount: 11000,
  },
];

export const TopHolderTable = () => {
  return (
    <div className="overflow-hidden" style={{ overflowX: "auto" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
      />
    </div>
  );
};
