import { FC } from "react";

interface Props {
  children: React.ReactNode;
}

export const ComponentCustomerWrapper: FC<Props> = ({ children, ...rest }) => {
  return <div className="container mx-auto  bg-slate-100">{children}</div>;
};
