import React, { useCallback, useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { IInvoice } from "../../interfaces";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getColorName } from "../../data";
const Orders = () => {
  const [allOrders, setAllOrders] = useState<IInvoice[]>([]);
  const navigate = useNavigate();
  const getAllOrders = useCallback(async () => {
    const req = await axiosInstance
      .get("invoices")
      .then((res) => res.data.invoices)
      .catch((err) => toast.error(err));
    setAllOrders(req);
  }, []);

  useEffect(() => {
    getAllOrders();
  }, [getAllOrders]);
  return (
    <div style={{ marginTop: "70px" }}>
      <table border={1} className="invoicesTable">
        <thead>
          <tr>
            <th>اسم العميل</th>
            <th>المنتجات</th>
            <th>الاجمالي</th>
            <th>الفاتورة</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th></th>
            <th style={{ display: "flex", border: 0 }}>
              <th style={{ width: "70%", border: 0 }}>الاسم </th>
              <th style={{ width: "10%", border: 0 }}>السعر </th>
              <th style={{ width: "10%", border: 0 }}>الكمية </th>
              <th style={{ width: "10%", border: 0 }}>اللون </th>
            </th>
            <th></th>
            <th></th>
          </tr>
          {allOrders
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((order) => (
              <tr>
                <td>{order.customerName}</td>
                <td>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                      {order.products.map((product) => (
                        <tr key={product._id} className="insideTableTr">
                          <td style={{ width: "70%" }}>{product.title}</td>
                          <td style={{ width: "10%" }}>{product.price}</td>
                          <td style={{ width: "10%" }}>{product.quantity}</td>
                          <td style={{ width: "10%" }}>
                            {getColorName(product.color)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
                <td>{order.totalAmount}</td>
                <td>
                  <button
                    className="invoicePrintBtn"
                    onClick={() => navigate(`/orders/${order._id}`)}
                  >
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
