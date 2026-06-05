import DefaultBarChart from "../DefaultBarChanrt";
import DefaultDonutChart from "../DefaultDonutChart";

interface IPointUseAndUserInformationProps {
  pointInfo: {
    symbol: string;
    total: number;
    balance: number;
  }[];
  endUserInfo: {
    total: number;
    unredeemedUsers: number;
    redeemedUsers: number;
  };
}
const PointUseAndUserInformation = ({
  pointInfo,
  endUserInfo,
}: IPointUseAndUserInformationProps) => {
  return (
    <>
      <DefaultBarChart
        title="Point Information"
        sub="(Point)"
        labels={pointInfo.map((p) => p.symbol)}
        series={[
          { name: "Total", type: "bar", data: pointInfo.map((p) => p.total) },
          {
            name: "Balance",
            type: "bar",
            data: pointInfo.map((p) => p.balance),
          },
        ]}
      />
      <DefaultDonutChart
        title="ข้อมูล End User"
        sub="คน"
        series={[
          endUserInfo.total,
          endUserInfo.unredeemedUsers,
          endUserInfo.redeemedUsers,
        ]}
        labels={[
          "จำนวน End User ที่ซื้อทั้งหมด",
          "จำนวน End User ซื้อแต่ยังไม่ใช้",
          "จำนวน End User redeem แล้วจริง ๆ",
        ]}
      />
    </>
  );
};

export default PointUseAndUserInformation;
