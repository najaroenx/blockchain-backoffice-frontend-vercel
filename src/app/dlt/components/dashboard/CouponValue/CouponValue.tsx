import DefaultCard2 from "../DefaultCard2";
import CircleChart from "../CircleChart";
import CircleChart2 from "../CircleChart2";
import DefaultDonutChart from "../DefaultDonutChart";
interface ICouponValueProps {
  couponValue: {
    total: number;
    unsold: number;
    sold: number;
    unredeemed: number;
    redeemed: number;
  };
  thbToken: {
    deposited: number;
    balance: number;
    bought: number;
  };
}
const CouponValue: React.FC<ICouponValueProps> = ({
  couponValue,
  thbToken,
}) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
      {/* ── Column 1-2: Coupon value cards ── */}
      <div className="xl:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DefaultCard2
          title="มูลค่า คูปองที่ขายทั้งหมด"
          sub={`${couponValue.total}`}
        />
        <DefaultCard2
          title="มูลค่า คูปองที่ยังไม่ได้ขาย"
          sub={`${couponValue.unsold}`}
        />
        <DefaultCard2
          title="มูลค่าคูปองที่ขายทั้งหมด THB"
          sub={`${couponValue.sold}`}
        />
        <DefaultCard2
          title="มูลค่าคูปองที่ End User ซื้อแต่ยังไม่ใช้ THB"
          sub={`${couponValue.unredeemed}`}
        />
        <DefaultCard2
          title="มูลค่าคูปองที่ End User redeem แล้วจริง ๆ THB"
          sub={`${couponValue.redeemed}`}
        />
      </div>
      {/* ── Column 3: THB Token donut ── */}
      <DefaultDonutChart
        title="THB (Token)"
        sub="มูลค่า THB Token"
        series={[thbToken.deposited, thbToken.balance, thbToken.bought]}
        labels={[
          "THB Token ที่เติมเข้าไปทั้งหมด",
          "THB Token ที่เหลือ Balance ",
          "THB Token ที่ใช้จองคูปอง จาก Promotion Seller",
        ]}
      />
    </div>
  );
};
export default CouponValue;
