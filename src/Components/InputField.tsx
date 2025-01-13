import React from "react";
import "./layout/layout.css";
interface InputFieldProps {
  type?: string;
  placeholder?: string;
  value?: string | number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  required?: boolean;
  [key: string]: any;
}

const InputField: React.FC<InputFieldProps> = ({
  type = "text",
  placeholder,
  value,
  onChange,
  label,
  required,
  ...rest
}) => {
  return (
    <div className="inputFieldContainer">
      {label && <label className="inputFieldLabel">{label}</label>}
      <input
        className="input-field"
        type={type}
        placeholder={label}
        value={value}
        onChange={onChange}
        required
        {...rest}
      />
    </div>
  );
};

export default InputField;
