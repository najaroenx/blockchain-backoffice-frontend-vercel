import { SimpleForm, Create, EditProps, Edit } from "react-admin";
import { PointForm } from "./PointForm";
import { CreateContainer } from "../layout/CreateContainer";
import { SaveToolbar } from "../customs/SaveToolbar";

export const PointEdit = (props: EditProps) => {
  return (
    <div className="bg-slate-100 h-full max-w-sm md:max-w-full">
      <div className="container mx-auto px-5 py-10">
        <h1 className="font-medium text-xl text-[#1C2A53] pb-5 md:pb-0">
          Edit Point Token
        </h1>
        <Edit {...props} component={CreateContainer} title={false}>
          <SimpleForm toolbar={<SaveToolbar />}>
            <PointForm isCreate={false} />
          </SimpleForm>
        </Edit>
      </div>
    </div>
  );
};
