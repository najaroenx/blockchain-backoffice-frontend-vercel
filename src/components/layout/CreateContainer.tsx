import { FC } from "react";

interface Props {
  children: React.ReactNode;
}

export const CreateContainer: FC<Props> = ({ children, ...rest }) => {
  return (
    <div className="container mx-auto px-5 py-5 bg-white rounded-lg shadow-lg">
      {children}
    </div>
  );
};
