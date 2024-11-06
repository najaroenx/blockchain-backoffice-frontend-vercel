import { ShowProps, SimpleForm, Create, Show } from "react-admin";
import { PointForm } from "./PointForm";
import { ComponentWrapper } from "../layout/ComponentWrapper";
import { SaveToolbar } from "../customs/SaveToolbar";
import { ComponentCustomerWrapper } from "../customs/ComponentCustomerWrapper";
import { PointShowLayout } from "./PointShowLayout";

export const PointShow = (props: ShowProps) => {
  return (
    <div className="bg-slate-100 h-full w-full md:max-w-full">
      <div className="container mx-auto px-5 py-10 md:py-14">
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h1 className="font-medium text-2xl text-[#1C2A53]">
              Point Detail
            </h1>
          </div>
          <hr className="border-slate-200 border-2" />
        </div>
        <Show
          {...props}
          component={ComponentCustomerWrapper}
          title={false}
          actions={false}
        >
          <PointShowLayout />
        </Show>
      </div>
    </div>
  );
};
