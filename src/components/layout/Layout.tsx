import { Layout } from "react-admin";
import { CustomAppBar } from "./AppBar";
import { CustomMenu } from "./Menu";

export const CustomLayout = ({ children }: { children: React.ReactNode }) => (
  <Layout
    appBar={CustomAppBar}
    menu={CustomMenu}
    sx={{
      "& .RaLayout-content": {
        width: "100%",
        padding: 0,
      },
    }}
  >
    {children}
  </Layout>
);
