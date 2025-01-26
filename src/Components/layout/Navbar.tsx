import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const logoutHandler = () => {
    localStorage.removeItem("tiaStoreToken");
    window.location.reload();
    navigate("/");
  };
  return (
    <div className="navbar">
      <div>
        <NavLink to="/home"> الرئيسية</NavLink>
        <NavLink to="/categories"> الاقسام</NavLink>
        <NavLink to="/products"> المنتجات</NavLink>
        <NavLink to="/add-order"> إضافة فاتورة</NavLink>
        <NavLink to="/orders"> الطلبات</NavLink>
        <NavLink to="/config"> الاعدادات</NavLink>
        <button className="logoutBtn" onClick={() => logoutHandler()}>
          <i className="fa-solid fa-sign-out"></i>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
