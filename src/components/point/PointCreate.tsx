"use client";
// import { useRouter } from "next/navigation";
import {
  CreateProps,
  SimpleForm,
  Create,
  useNotify,
} from "react-admin";
import { PointForm } from "./PointForm";
import { ComponentWrapper } from "../layout/ComponentWrapper";
import { SaveToolbar } from "../customs/SaveToolbar";
import { useParams } from "next/navigation";
import { useLoading } from "@/contexts/LoadingContext";

export const PointCreate = (props: CreateProps) => {
  const notify = useNotify();
  const { merchantId } = useParams();
  const { showLoading, hideLoading } = useLoading();

  return (
    <div className="bg-slate-100 h-full w-full md:max-w-full relative">
      <div className="container mx-auto px-5 py-10">
        <h1 className="font-medium text-xl text-[#1C2A53] pb-5 md:pb-0">
          Create Point
        </h1>
        <Create
          {...props}
          component={ComponentWrapper}
          title={false}
          mutationOptions={{
            onMutate: () => {
              showLoading();
            },
            onSuccess: () => {
              hideLoading();
              notify("Point created successfully", { type: "info" });
              window.location.href = `/admin/${merchantId}#/point`;
            },
            onError: () => {
              hideLoading();
            },
            onSettled: () => {
              hideLoading();
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
