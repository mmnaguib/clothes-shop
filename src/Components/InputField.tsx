import React from "react";

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
    <div
      style={{ marginBottom: "15px", display: "flex", flexDirection: "column" }}
    >
      {label && (
        <label
          style={{
            fontSize: "1rem",
            marginBottom: "5px",
            color: "#555",
            fontWeight: "600",
          }}
        >
          {label}
        </label>
      )}
      <input
        style={{
          padding: "10px",
          fontSize: "1rem",
          border: "1px solid #ccc",
          borderRadius: "4px",
          outline: "none",
          transition: "border-color 0.3s ease",
        }}
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
