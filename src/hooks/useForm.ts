import { useCallback, useState } from "react";
import type { ChangeEvent } from "react";

type FormValues = Record<string, string>;

export const useForm = <T extends FormValues>(initialValues: T) => {
  const [formValues, setFormValues] = useState<T>(initialValues);

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setFormValues((previous) => ({
        ...previous,
        [name]: value,
      }));
    },
    [],
  );

  return {
    formValues,
    setFormValues,
    handleInputChange,
  };
};