import "./alert.css";

const Alert = ({
  type = "success",
  children,
}: {
  type?: "success" | "error" | "info";
  children?: React.ReactNode;
}) => {
  return <div className={`alert ${type}`}>{children}</div>;
};

export default Alert;
