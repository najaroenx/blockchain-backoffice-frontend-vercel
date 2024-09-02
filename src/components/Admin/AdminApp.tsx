"use client";
import jsonServerProvider from "ra-data-json-server";
import { Admin, Resource } from "react-admin";
import { Login } from "../layout/Login";
import { authProvider } from "./authProvider";
import { useSession } from "next-auth/react";
import { CustomLayout } from "../layout/Layout";
import { Index } from "../dashboard";
import PointList from "../point/PointList";
import { PointCreate } from "../point";

const dataProvider = jsonServerProvider("/api");

const AdminApp = () => {
  const { data: session } = useSession();

  return (
    <Admin
      dataProvider={dataProvider}
      defaultTheme="light"
      loginPage={Login}
      authProvider={authProvider(session)}
      layout={CustomLayout}
      dashboard={Index}
    >
      <Resource name="point" list={PointList} create={PointCreate} />
    </Admin>
  );
};

export default AdminApp;
