import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const logoutHandler = () => {
    localStorage.removeItem("authToken");
    window.location.reload();
    navigate("/");
  };
  return (
    <div className="navbar">
      <div>
        <NavLink to="/home"> الرئيسية</NavLink>
        {/* <NavLink to="/config"> الاعدادات</NavLink> */}
        <NavLink to="/products"> المنتجات</NavLink>
        <NavLink to="/add-order"> إضافة فاتورة</NavLink>
        <NavLink to="/categories"> الاقسام</NavLink>
        <button onClick={() => logoutHandler()}>logout</button>
      </div>
    </div>
  );
};

export default Navbar;
