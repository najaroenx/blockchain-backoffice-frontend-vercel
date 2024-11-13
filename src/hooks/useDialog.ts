import { useState } from "react";

export const useDialog = (): [boolean, () => void] => {
  const [open, setOpen] = useState(false);

  const handleToggle = (): void => {
    setOpen(!open);
  };
  return [open, handleToggle];
};
