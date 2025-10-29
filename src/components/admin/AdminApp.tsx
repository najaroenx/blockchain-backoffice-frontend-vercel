"use client";

import jsonServerProvider from "ra-data-json-server";
import { Admin, CustomRoutes, Resource } from "react-admin";
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
import { Loading } from "../layout/Loading";
import VoucherList from "../voucher/VoucherList";
import VoucherSetup from "../voucher/VoucherSetup";
import { MerchantEdit } from "../merchant/MerchantEdit";
import { useParams } from "next/navigation";
import { Route } from "react-router-dom";
import { Setting } from "../setting/Setting";
import { MerchantProvider } from "@/contexts/MerchantContext";

const AdminApp = () => {
  const { merchantId } = useParams();
  const dataProvider = jsonServerProvider(`/api/${merchantId}`);

  return (
    <MerchantProvider value={merchantId as string}>
      <Admin
        dataProvider={dataProvider}
        defaultTheme="light"
        layout={CustomLayout}
        dashboard={Dashboard}
        loading={Loading}
      >
        <Resource
          name="point"
          list={PointList}
          create={PointCreate}
          edit={PointEdit}
        />
        <Resource
          name="merchant"
          list={MerchantList}
          create={MerchantCreate}
          edit={MerchantEdit}
        />
        <Resource name="api-key" list={ApiKeyList} create={ApiKeyCreate} />
        <Resource name="transaction" />
        <Resource name="customer" list={CustomerList} show={CustomerShow} />
        <Resource name="voucher" list={VoucherList} />
        <CustomRoutes>
          <Route path="/setting" element={<Setting />} />
          <Route path="/voucher/setup" element={<VoucherSetup />} />
        </CustomRoutes>
      </Admin>
    </MerchantProvider>
  );
};

export default AdminApp;
