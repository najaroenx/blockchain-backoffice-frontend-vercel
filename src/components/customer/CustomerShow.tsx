import { ShowProps, Show, TextField } from "react-admin";
import { ComponentCustomerWrapper } from "./ComponentCustomerWrapper";
import EmailIcon from "@mui/icons-material/EmailOutlined";
import WalletIcon from "@mui/icons-material/WalletOutlined";
import { CustomerTransactionTable } from "./CustomerTransactionTable";

export const CustomerShow = (props: ShowProps) => {
  return (
    <div className="bg-slate-100 h-full w-full md:max-w-full">
      <div className="container mx-auto px-5 py-14">
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h1 className="font-medium text-2xl text-[#1C2A53]">
              Customer Detail
            </h1>
          </div>
          <hr className="border-slate-200 border-2" />
        </div>
        <Show {...props} component={ComponentCustomerWrapper} title={false}>
          <div className="w-full h-full">
            <div className="flex flex-col md:flex-row gap-10">
              <div className="flex flex-col bg-white py-5 px-10 mt-5 shadow-lg rounded-lg gap-5 w-1/3">
                <div className="flex justify-center">
                  <div className="w-32 h-32 bg-red-600 rounded-full object-cover " />
                </div>
                <div className="flex justify-center items-center gap-x-1">
                  <EmailIcon
                    sx={{
                      fontWeight: "bold",
                      color: "#1C2A53",
                      textAlign: "center",
                    }}
                  />
                  <TextField
                    source="email"
                    sx={{
                      fontWeight: "bold",
                      color: "#1C2A53",
                      textAlign: "center",
                      fontSize: "14px",
                    }}
                  />
                </div>
                <div className="flex justify-center items-center gap-x-1">
                  <WalletIcon
                    sx={{
                      fontWeight: "bold",
                      color: "#1C2A53",
                      textAlign: "center",
                    }}
                  />
                  <TextField
                    source="walletAddress"
                    sx={{
                      fontWeight: "bold",
                      color: "#1C2A53",
                      textAlign: "center",
                      fontSize: "14px",
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col bg-white py-5 px-5 mt-5 shadow-lg rounded-lg gap-5 w-2/3"></div>
            </div>
            <div className="flex flex-col bg-white py-5 px-5 mt-5 shadow-lg rounded-lg gap-5 ">
              <h6 className="font-base text-black text-lg">Transactions</h6>
              <div className="w-full">
                <CustomerTransactionTable />
              </div>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
};
