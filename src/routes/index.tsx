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

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Root />}>
        <Route index element={<Home />} />
        <Route path="config" element={<Config />} />
        <Route path="products" element={<Products />} />
        <Route path="add-order" element={<AddOrder />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </>
  )
);
export default router;
