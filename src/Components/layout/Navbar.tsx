import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="navbar">
      <div>
        <NavLink to="/"> الرئيسية</NavLink>
        <NavLink to="/config"> الاعدادات</NavLink>
        <NavLink to="/products"> المنتجات</NavLink>
        <NavLink to="/add-order"> إضافة فاتورة</NavLink>
      </div>
    </div>
  );
};

export default Navbar;
