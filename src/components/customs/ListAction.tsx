import { TopToolbar, CreateButton } from "react-admin";

interface Props {
  title: string;
}

export const ListActions = ({ title }: Props) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-row items-center justify-between">
        <h1 className="font-medium text-2xl text-[#1C2A53] w-2/3">{title}</h1>
        <TopToolbar className="bg-slate-100 w-1/3">
          <CreateButton className="py-3 px-2 text-white bg-[#FF8901] hover:bg-[#fbbf7a] font-bold" />
        </TopToolbar>
      </div>
      <hr className="border-slate-200 border-2" />
    </div>
  );
};
