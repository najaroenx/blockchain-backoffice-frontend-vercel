import { SettingForm } from "./SettingForm";

export const Setting = () => {
  return (
    <div className="bg-slate-100 h-full w-full md:max-w-full">
      <div className="container mx-auto px-5 py-10">
        <div className="flex flex-col">
          <h1 className="font-medium text-2xl text-[#1C2A53]  mb-5">Setting</h1>
          <SettingForm />
        </div>
      </div>
    </div>
  );
};
