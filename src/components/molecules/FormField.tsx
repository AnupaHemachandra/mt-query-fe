import React from "react";
import Input from "../atoms/Input";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const FormField: React.FC<FormFieldProps> = ({ label, ...props }) => {
  return <Input label={label} {...props} />;
};

export default FormField;
