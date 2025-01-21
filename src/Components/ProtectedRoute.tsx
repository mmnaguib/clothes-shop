import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const tiaStoreToken = localStorage.getItem("tiaStoreToken");

  return tiaStoreToken ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
