import { CreateProps, SimpleForm, Create, useRedirect } from "react-admin";
import { CreateContainer } from "../layout/CreateContainer";
import { SaveToolbar } from "../customs/SaveToolbar";
import { MerchantForm } from "./MerchantForm";
import { useQueryClient } from "@tanstack/react-query";

export const MerchantCreate = (props: CreateProps) => {
  const queryClient = useQueryClient();
  const redirect = useRedirect();

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["merchant"] });
    redirect(`/merchant`);
  };

  return (
    <div className="bg-slate-100 h-full w-full md:max-w-full">
      <div className="container mx-auto px-5 py-10">
        <h1 className="font-medium text-xl text-[#1C2A53] pb-5 md:pb-0">
          Create New Merchant
        </h1>
        <Create
          {...props}
          component={CreateContainer}
          title={false}
          mutationOptions={{ onSuccess }}
        >
          <SimpleForm toolbar={<SaveToolbar />}>
            <MerchantForm />
          </SimpleForm>
        </Create>
      </div>
    </div>
  );
};
