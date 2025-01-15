import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const authToken = localStorage.getItem("authToken");

  return authToken ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
