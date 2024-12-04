import { Toolbar, SaveButton, DeleteWithConfirmButton } from "react-admin";

interface Props {
  enableDelete: boolean;
}

export const SaveToolbar = ({ enableDelete }: Props) => {
  return (
    <Toolbar className="flex justify-between bg-white">
      <SaveButton
        label="Save"
        className="bg-[#FF8901] hover:bg-[#fbbf7a] shadow-none text-white disabled:bg-[#fbbf7a]"
      />
      {enableDelete && (
        <DeleteWithConfirmButton
          label="Delete"
          className="bg-[#f12b2b] hover:bg-[#f57a7a] shadow-none text-white p-3"
          confirmColor="warning"
          confirmContent="You will not be able to recover this record. Are you sure?"
          confirmTitle={`Delete point`}
          mutationMode="pessimistic"
        />
      )}
    </Toolbar>
  );
};

SaveToolbar.defaultProps = {
  enableDelete: false,
};
