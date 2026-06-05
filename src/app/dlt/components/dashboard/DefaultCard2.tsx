import Image from "next/image";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
interface IDefaultCard2Props {
  title: string;
  timeStr?: string;
  dateStr?: string;
  sub: string;
}
const DefaultCard2: React.FC<IDefaultCard2Props> = ({
  timeStr = new Date().toLocaleTimeString(),
  dateStr = new Date().toLocaleDateString(),
  title = "Your title",
  sub = "Sub title",
}) => {
  return (
    <div className="flex flex-col gap-5">
      {/* Greeting card */}
      <div className="bg-[#111827] rounded-2xl p-5 border border-gray-700/40 flex flex-col justify-between flex-1">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wider text-indigo-400 uppercase">
                {title}
            </p>
            <h3 className="text-xl font-bold text-white mt-1">{sub}</h3>
          </div>
          {/* <Image
            src="/images/icons/greeting-illustration.svg"
            alt="greeting"
            width={80}
            height={80}
            className="object-contain"
          /> */}
        </div>
        <div className="flex items-center gap-6 mt-4 text-gray-400 text-sm">
          <span className="flex items-center gap-1.5">
            <CalendarTodayOutlinedIcon sx={{ fontSize: 16 }} />
            {dateStr}
          </span>
          <span className="flex items-center gap-1.5">
            {/* <AccessTimeOutlinedIcon sx={{ fontSize: 16 }} /> */}
            {/* {timeStr} */}
          </span>
        </div>
      </div>
    </div>
  );
};
export default DefaultCard2;
