import { useCallback, useState } from "react";

export const useDialog = (): [boolean, () => void] => {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => {
    setOpen((previous) => !previous);
  }, []);

  return [open, toggle];
};