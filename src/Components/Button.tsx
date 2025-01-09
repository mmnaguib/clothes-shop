import React from "react";

interface AddButtonProps {
  onClick?: () => void;
  label?: string;
}

const Button: React.FC<AddButtonProps> = ({ onClick, label = "Add" }) => {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: "#28a745",
        color: "#fff",
        fontSize: "1rem",
        fontWeight: "bold",
        border: "none",
        borderRadius: "5px",
        padding: "10px 20px",
        cursor: "pointer",
        transition: "background-color 0.3s ease, transform 0.2s ease",
      }}
      className="add-button"
    >
      {label}
    </button>
  );
};

export default Button;
