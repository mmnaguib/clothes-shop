import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import PageNotFound from "../Pages/PageNotFound";
import { Root } from "../Pages/Root/Root";
import Config from "../Pages/settings/Config";
import Products from "../Pages/Product/Products";
import AddOrder from "../Pages/order/AddOrder";
import Home from "../Pages/Home/Home";
import Categories from "../Pages/categories/Categories";
import Login from "../Pages/login/Login";
import ProtectedRoute from "../Components/ProtectedRoute";
import Orders from "../Pages/order/Orders";
import Invoice from "../Pages/Invoice/Invoice";
const isLoggedIn = !!localStorage.getItem("tiaStoreToken");

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Root />}>
        <Route index element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={isLoggedIn ? <Home /> : <Login />} />
          <Route path="config" element={isLoggedIn ? <Config /> : <Login />} />
          <Route
            path="products"
            element={isLoggedIn ? <Products /> : <Login />}
          />
          <Route
            path="add-order"
            element={isLoggedIn ? <AddOrder /> : <Login />}
          />
          <Route
            path="categories"
            element={isLoggedIn ? <Categories /> : <Login />}
          />
          <Route path="orders" element={isLoggedIn ? <Orders /> : <Login />} />
          <Route
            path="orders/:id"
            element={isLoggedIn ? <Invoice /> : <Login />}
          />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Route>
    </>
  )
);
export default router;
