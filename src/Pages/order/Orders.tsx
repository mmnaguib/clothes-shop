import React, { useCallback, useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { IInvoice } from "../../interfaces";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const [allOrders, setAllOrders] = useState<IInvoice[]>([]);
  const navigate = useNavigate();
  const getAllOrders = useCallback(async () => {
    const req = await axiosInstance
      .get("invoices")
      .then((res) => res.data.invoices)
      .catch((err) => console.log(err));
    setAllOrders(req);
  }, []);

  useEffect(() => {
    getAllOrders();
  }, [getAllOrders]);
  return (
    <div>
      <table border={1} className="invoicesTable">
        <thead>
          <th>اسم العميل</th>
          <th>المنتجات</th>
          <th>الاجمالي</th>
          <th>الفاتورة</th>
        </thead>
        <tbody>
          {allOrders.map((order) => (
            <tr>
              <td>{order.customerName}</td>
              <td>
                <table border={1} className="invoicesTable">
                  <thead>
                    <tr>
                      <th>الاسم </th>
                      <th>السعر </th>
                      <th>الكمية </th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.products.map((product) => (
                      <tr>
                        <td>{product.title}</td>
                        <td>{product.price}</td>
                        <td>{product.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
              <td>{order.totalAmount}</td>
              <td>
                <button onClick={() => navigate(`/orders/${order._id}`)}>
                  الفاتورة
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
