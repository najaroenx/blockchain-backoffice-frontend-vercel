import { TextField, useShowContext } from "react-admin";
import EmailIcon from "@mui/icons-material/EmailOutlined";
import WalletIcon from "@mui/icons-material/WalletOutlined";
import { CustomerTransactionTable } from "./CustomerTransactionTable";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLongOutlined";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonthOutlined";
import { Loading } from "../layout/Loading";
import { Point } from "./types/point.type";
import Image from "next/image";

export const CustomerShowLayout = () => {
  const { record, isPending } = useShowContext();

  if (isPending || !record.customerPoints) return <Loading />;

  return (
    <div className="w-full h-full">
      <div className="flex flex-col md:flex-row gap-10">
        <div className="flex flex-col bg-white py-4 px-5 md:px-10 mt-5 shadow-lg rounded-lg gap-4 w-full md:w-1/3">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-red-600 rounded-full object-cover " />
          </div>
          <div className="flex justify-center items-center gap-x-1">
            <EmailIcon
              sx={{
                fontWeight: "bold",
                textAlign: "center",
              }}
            />
            <p className="font-bold text-sm">{record.email}</p>
          </div>
          <div className="flex justify-center items-center gap-x-1">
            <WalletIcon
              sx={{
                fontWeight: "bold",
                textAlign: "center",
              }}
            />
            <p className="font-bold text-sm">
              {record.walletAddress.slice(0, 10) +
                "..." +
                record.walletAddress.slice(-10)}
            </p>
          </div>

          <hr className="border-slate-200" />

          <div className="flex flex-col gap-5">
            <div className="flex flex-row items-center gap-2">
              <ReceiptLongIcon
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              />
              <p className="font-semibold text-sm">Total Transactions :</p>
              <p className="font-semibold text-sm">
                {record.transactions?.length}
              </p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <CalendarMonthIcon
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              />
              <p className="font-semibold text-sm">First Transaction :</p>
              <p className="font-semibold text-sm">
                September 30, 2019 1:49 PM
              </p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <CalendarMonthIcon
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              />
              <p className="font-semibold text-sm">Last Transaction :</p>
              <p className="font-semibold text-sm">
                September 30, 2019 1:49 PM
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col bg-white py-5 px-5 mt-1 md:mt-5 shadow-lg rounded-lg gap-5 w-full md:w-2/3">
          <p className="font-bold text-black text-base font-notoEng">
            Customer Assets
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 h-72 overflow-y-scroll py-5">
            {record.customerPoints.map((point: Point) => (
              <div
                className="border border-slate-200 rounded-lg shadow-lg"
                key={point.id}
              >
                <div className="relative overflow-hidden text-gray-700 bg-white bg-clip-border rounded-lg h-40">
                  {/* <Image
                    src="https://media.discordapp.net/attachments/1033975412444893264/1072422794983378974/Component_4.png?ex=66ec7f4e&is=66eb2dce&hm=b3159e91c8076398b8f3c937f796c008d11cb13edc2c2097a6dad4ef82f212a2&=&format=webp&quality=lossless&width=1170&height=1170"
                    alt="card-image"
                    layout="fill"
                    objectFit="cover"
                  /> */}
                </div>
                <div className="flex flex-col px-5 py-2 gap-2 text-wrap">
                  <p className="text-xs font-semibold">
                    Point Name: {point.name}
                  </p>
                  <p className="text-xs font-semibold">
                    Symbol: {point.symbol}
                  </p>
                  <p className="text-xs font-semibold">
                    Balances: {point.balances}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col bg-white py-5 px-5 mt-5 shadow-lg rounded-lg gap-5">
        <h6 className="font-base text-lg font-semibold ">Transactions</h6>
        <div className="flex items-center justify-center">
          <CustomerTransactionTable />
        </div>
      </div>
    </div>
  );
};
