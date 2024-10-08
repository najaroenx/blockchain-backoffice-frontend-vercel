import {
  useListContext,
  RecordContextProvider,
  useCreatePath,
  Link,
} from "react-admin";
import EmailIcon from "@mui/icons-material/EmailOutlined";
import WalletIcon from "@mui/icons-material/WalletOutlined";

const MobileDataGrid = () => {
  const { data, error, isPending } = useListContext();
  const createPath = useCreatePath();

  if (isPending || error || data.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      {data.map((record) => (
        <RecordContextProvider key={record.id} value={record}>
          <Link
            to={createPath({
              resource: "customer",
              type: "show",
              id: record.id,
            })}
            underline="none"
            color="inherit"
          >
            <div className="border bg-white rounded-lg my-2 py-5">
              <div className="flex flex-col m-0.5 gap-5 ">
                <div className="flex items-center gap-x-2 px-10">
                  <EmailIcon
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  />
                  <p className="font-bold text-sm">{record.email}</p>
                </div>
                <div className="flex items-center gap-x-2 px-10">
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
              </div>
            </div>
          </Link>
        </RecordContextProvider>
      ))}
    </div>
  );
};

export default MobileDataGrid;
