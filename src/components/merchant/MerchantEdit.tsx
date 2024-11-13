import {
  SimpleForm,
  EditProps,
  Edit,
  Toolbar,
  SaveButton,
  useRedirect,
  useRefresh,
  useNotify,
  DeleteWithConfirmButton,
  useRecordContext,
} from "react-admin";
import { ComponentWrapper } from "../layout/ComponentWrapper";
import { MerchantForm } from "./MerchantForm";

const CustomToolbar = () => {
  const record = useRecordContext();
  const redirect = useRedirect();
  const refresh = useRefresh();
  const notify = useNotify();

  const onSuccess = () => {
    notify(`Success`, {
      type: "success",
    });
    redirect("/merchant");
    refresh();
  };

  return (
    <Toolbar className="flex justify-between bg-white">
      <DeleteWithConfirmButton
        label="Delete"
        className="bg-[#f12b2b] hover:bg-[#f57a7a] shadow-none text-white p-3"
        confirmColor="primary"
        confirmContent="You will not be able to recover this record. Are you sure?"
        confirmTitle={`Delete merchant ${record?.name}`}
        mutationOptions={{ onSuccess }}
        mutationMode="pessimistic"
      />

      <SaveButton
        label="Save"
        className="bg-[#FF8901] hover:bg-[#fbbf7a] shadow-none text-white p-3"
      />
    </Toolbar>
  );
};

export const MerchantEdit = (props: EditProps) => {
  const redirect = useRedirect();
  const refresh = useRefresh();
  const notify = useNotify();

  const onSuccess = () => {
    notify(`Success`, {
      type: "success",
    });
    redirect("/merchant");
    refresh();
  };

  return (
    <div className="bg-slate-100 h-full max-w-sm md:max-w-full">
      <div className="container mx-auto px-5 py-10">
        <h1 className="font-medium text-xl text-[#1C2A53] pb-5 md:pb-0">
          Edit Merchant
        </h1>
        <Edit
          {...props}
          component={ComponentWrapper}
          title={false}
          actions={false}
          mutationOptions={{ onSuccess }}
          mutationMode="pessimistic"
        >
          <SimpleForm toolbar={<CustomToolbar />}>
            <MerchantForm isCreate={false} />
          </SimpleForm>
        </Edit>
      </div>
    </div>
  );
};
