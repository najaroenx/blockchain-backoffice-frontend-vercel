import { Toolbar, SaveButton, DeleteWithConfirmButton } from "react-admin";

export const SettingToolbar = () => {
  return (
    <Toolbar className="flex justify-between bg-white">
      <SaveButton
        label="Save"
        className="bg-[#FF8901] hover:bg-[#fbbf7a] shadow-none text-white disabled:bg-[#fbbf7a]"
      />
      <DeleteWithConfirmButton
        label="Delete"
        className="py-3 px-3"
        confirmTitle="Delete Merchant"
        confirmContent="You will not be able to recover this record. Are you sure?"
        confirmColor="warning"
        mutationOptions={{
          onSuccess: () => {
            window.location.replace("/portal");
          },
        }}
      />
    </Toolbar>
  );
};
