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

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Root />}>
        <Route index element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="config" element={<Config />} />
          <Route path="products" element={<Products />} />
          <Route path="add-order" element={<AddOrder />} />
          <Route path="categories" element={<Categories />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<Invoice />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Route>
    </>
  )
);
export default router;
