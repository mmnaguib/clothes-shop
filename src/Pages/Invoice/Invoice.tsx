import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { IConfig, IInvoice } from "../../interfaces";
import Button from "../../Components/Button";

const Invoice = () => {
  const { id } = useParams();
  const [invoiceDetail, setInvoiceDetail] = useState<IInvoice | null>(null);
  const [campany, setCampany] = useState<IConfig | null>(null);

  const token = localStorage.getItem("authToken")!;
  const decoded = JSON.parse(atob(token.split(".")[1]));
  const getOrderDetail = useCallback(async (id: string) => {
    const req = await axiosInstance
      .get(`invoices/${id}`)
      .then((res) => res.data.invoice)
      .catch((err) => console.log(err));
    setInvoiceDetail(req);
  }, []);

  const getCompanyData = useCallback(async (id: string) => {
    const req = await axiosInstance
      .get(`companies/${id}`)
      .then((res) => res.data.company)
      .catch((err) => console.log(err));
    setCampany(req);
    return req;
  }, []);

  useEffect(() => {
    getCompanyData("67881c153d737752bbbcbe78");
  }, [getCompanyData]);

  const totalQuantity = useMemo(() => {
    return (
      invoiceDetail?.products.reduce(
        (total, product) => total + product.quantity,
        0
      ) || 0
    );
  }, [invoiceDetail]);

  useEffect(() => {
    getOrderDetail(`${id}`);
  }, [id, getOrderDetail]);
  return (
    <div
      style={{ marginTop: "50px", textAlign: "center", position: "relative" }}
    >
      <button
        id="printBtn"
        onClick={() => window.print()}
        style={{ position: "absolute", left: "10px", top: "10px" }}
      >
        طباعة
      </button>
      <h3>تيا استور (Ts)</h3>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>التاريخ : {invoiceDetail?.createdAt.slice(0, 10)}</div>
        <div>الوقت : {invoiceDetail?.createdAt.slice(12, 20)}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>الكاشير: {decoded.userName}</div>
        <div>.</div>
      </div>
      <table border={1} style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>الصنف</th>
            <th>الكمية</th>
            <th>السعر</th>
            <th>الاجمالي</th>
          </tr>
        </thead>
        <tbody>
          {invoiceDetail?.products.map((product) => (
            <tr>
              <td>{product.title}</td>
              <td>{product.quantity}</td>
              <td>{product.price}</td>
              <td>{product.price * product.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <table style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td style={{ width: "40%" }}>
                <h3>الاجمالي</h3>
              </td>
              <td>
                <h3>{totalQuantity}</h3>
              </td>
              <td style={{ textAlign: "left" }}>
                <h3>{invoiceDetail?.totalAmount} جنيه</h3>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <hr />
      <div>
        {campany?.companyName}
        <br />
        {campany?.address}
        <br />
        {campany?.phoneNumber}
      </div>
    </div>
  );
};

export default Invoice;
