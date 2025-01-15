import { useState } from "react";
import "./login.css";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../utils/axiosInstance";
const Login = () => {
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const formHandler = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!userName) {
      toast.error("الرجاء إدخال البريد الإلكتروني");
      return;
    }
    if (!password) {
      toast.error("الرجاء إدخال كلمة المرور");
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/login", {
        userName,
        password,
      });
      console.log(res);
      if (res.status === 200) {
        navigate("/home");
        toast.success("تم تسجيل الدخول بنجاح ");
        localStorage.setItem("authToken", res.data.token);
        window.location.reload();
      } else {
        setUserName("");
        setPassword("");
        toast.error("البريد الالكتروني او كلمة المرور غير صحيحة");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response && err.response.status === 400) {
          toast.error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        } else {
          toast.error("حدث خطأ أثناء الاتصال بالخادم.");
        }
      } else {
        toast.error("حدث خطأ غير معروف.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="loginContainer">
      <div className="loginPage">
        <form onSubmit={formHandler}>
          <div className="form-group">
            <label>البريد الالكتروني</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="inputField"
              placeholder="البريد الالكتروني"
              style={{ direction: "ltr" }}
              required
            />
          </div>
          <div className="form-group">
            <label>كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="inputField"
              placeholder="كلمة المرور"
              style={{ direction: "ltr" }}
              required
            />
          </div>
          <button type="submit" className="btn submitBtn" disabled={loading}>
            {loading ? <i className="fa-solid fa-spinner"></i> : "تسجيل الدخول"}
          </button>
        </form>
        <Link to="/register">ليس لديك حساب ؟</Link>
      </div>
    </div>
  );
};

export default Login;
