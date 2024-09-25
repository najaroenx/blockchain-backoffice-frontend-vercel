"use client";

import jsonServerProvider from "ra-data-json-server";
import { Admin, Resource, localStorageStore, fetchUtils } from "react-admin";
import { Login } from "../layout/Login";
import { authProvider } from "./authProvider";
import { useSession } from "next-auth/react";
import { CustomLayout } from "../layout/Layout";
import { Dashboard } from "../dashboard/Dashboard";
import PointList from "../point/PointList";
import { PointCreate } from "../point";
import MerchantList from "../merchant/MerchantList";
import { MerchantCreate } from "../merchant";
import { ApiKeyCreate, ApiKeyList } from "../api-key";
import { PointEdit } from "../point/PointEdit";
import { CustomerList } from "../customer/CustomerList";
import { CustomerShow } from "../customer/CustomerShow";

const fetchJson = (url: string, options: fetchUtils.Options = {}) => {
  const customHeaders = (options.headers ||
    new Headers({
      Accept: "application/json",
    })) as Headers;

  const merchantId = localStorage.getItem("RaStore.currentMerchant");

  const cleanedMerchantId = merchantId ? merchantId.replace(/"/g, "") : "";

  customHeaders.set("Merchant-Id", cleanedMerchantId);
  options.headers = customHeaders;

  return fetchUtils.fetchJson(url, options);
};

const AdminApp = () => {
  const { data: session } = useSession();
  const dataProvider = jsonServerProvider(`/api`, fetchJson);

  return (
    <Admin
      dataProvider={dataProvider}
      defaultTheme="light"
      loginPage={Login}
      authProvider={authProvider(session)}
      layout={CustomLayout}
      dashboard={Dashboard}
      store={localStorageStore()}
    >
      <Resource
        name="point"
        list={PointList}
        create={PointCreate}
        edit={PointEdit}
      />
      <Resource name="merchant" list={MerchantList} create={MerchantCreate} />
      <Resource name="api-key" list={ApiKeyList} create={ApiKeyCreate} />
      <Resource name="transaction" />
      <Resource name="customer" list={CustomerList} show={CustomerShow} />
    </Admin>
  );
};

export default AdminApp;
