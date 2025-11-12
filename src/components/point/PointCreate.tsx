"use client";
// import { useRouter } from "next/navigation";
import {
  CreateProps,
  SimpleForm,
  Create,
  useRedirect,
  useNotify,
} from "react-admin";
import { PointForm } from "./PointForm";
import { ComponentWrapper } from "../layout/ComponentWrapper";
import { SaveToolbar } from "../customs/SaveToolbar";
import { useParams } from "next/navigation";

export const PointCreate = (props: CreateProps) => {
  const redirect = useRedirect();
  const notify = useNotify();
  const { merchantId } = useParams();

  return (
    <div className="bg-slate-100 h-full w-full md:max-w-full">
      <div className="container mx-auto px-5 py-10">
        <h1 className="font-medium text-xl text-[#1C2A53] pb-5 md:pb-0">
          Create Point
        </h1>
        <Create
          {...props}
          component={ComponentWrapper}
          title={false}
          mutationOptions={{
            onSuccess: () => {
              notify("Point created successfully", { type: "info" });
              const target = merchantId
                ? `/merchant/${merchantId}/point`
                : "/point";
              redirect(target);
            },
          }}
        >
          <SimpleForm toolbar={<SaveToolbar />}>
            <PointForm isCreate={true} />
          </SimpleForm>
        </Create>
      </div>
    </div>
  );
};
