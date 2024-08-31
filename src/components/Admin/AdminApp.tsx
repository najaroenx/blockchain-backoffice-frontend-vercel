"use client";
import jsonServerProvider from "ra-data-json-server";
import { Admin, Resource, ListGuesser, EditGuesser } from "react-admin";
import { Login } from "../layout/Login";
import { authProvider } from "./authProvider";
import { useSession } from "next-auth/react";
import { CustomLayout } from "../layout/Layout";
import { Index } from "../dashboard";

const dataProvider = jsonServerProvider("https://jsonplaceholder.typicode.com");

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
      <Resource
        name="users"
        list={ListGuesser}
        edit={EditGuesser}
        recordRepresentation="name"
      />
      <Resource
        name="posts"
        list={ListGuesser}
        edit={EditGuesser}
        recordRepresentation="title"
      />
      <Resource name="comments" list={ListGuesser} edit={EditGuesser} />
    </Admin>
  );
};

export default AdminApp;
