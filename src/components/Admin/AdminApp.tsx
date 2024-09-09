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
import MerchantList from "../merchant/MerchantList";
import { MerchantCreate } from "../merchant";
import { ApiKeyCreate, ApiKeyList } from "../api-key";

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
      <Resource name="merchant" list={MerchantList} create={MerchantCreate} />
      <Resource name="api-key" list={ApiKeyList} create={ApiKeyCreate} />
    </Admin>
  );
};

export default AdminApp;
