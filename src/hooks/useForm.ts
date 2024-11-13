import { useState } from "react";

type FormValues = {
  name: string;
  website: string;
};

export const useForm = (initialValues: FormValues) => {
  const [formValues, setFormValues] = useState<FormValues>(initialValues);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value,
    });
  };

  return {
    formValues,
    handleInputChange,
    setFormValues,
  };
};
