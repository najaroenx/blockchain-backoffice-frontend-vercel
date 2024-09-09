import { CreateProps, SimpleForm, Create } from "react-admin";
import { CreateContainer } from "../layout/CreateContainer";
import { SaveToolbar } from "../customs/SaveToolbar";
import { ApiKeyForm } from "./ApiKeyForm";

export const ApiKeyCreate = (props: CreateProps) => {
  return (
    <div className="bg-slate-100 h-full w-full md:max-w-full">
      <div className="container mx-auto px-5 py-10">
        <h1 className="font-medium text-xl text-[#1C2A53] pb-5 md:pb-0">
          Create New Api Key
        </h1>
        <Create {...props} component={CreateContainer} title={false}>
          <SimpleForm toolbar={<SaveToolbar />}>
            <ApiKeyForm />
          </SimpleForm>
        </Create>
      </div>
    </div>
  );
};
