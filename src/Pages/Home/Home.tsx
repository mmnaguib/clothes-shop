import React, { useCallback, useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { IConfig } from "../../interfaces";
import { toast } from "react-toastify";
import ProductService from "../../services/productService";
import CategoryService from "../../services/categoryService";
import "./home.css";
import { Link } from "react-router-dom";
const Home = () => {
  const [campany, setCampany] = useState<IConfig | null>(null);
  const [productsCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const companyId = localStorage.getItem("companyId")!;
  const getCompanyData = useCallback(async (id: string) => {
    const req = await axiosInstance
      .get(`companies/${id}`)
      .then((res) => res.data.company)
      .catch((err) => toast.error(err));
    setCampany(req);
    return req;
  }, []);

  const getCount = async () => {
    setProductCount(
      (await ProductService.getProductsCount()).data.totalProducts
    );
    setCategoryCount(
      (await CategoryService.getCategoriesCount()).data.totalCategories
    );
  };

  useEffect(() => {
    getCompanyData(companyId);
  }, [getCompanyData]);

  useEffect(() => {
    getCount();
  }, []);

  return (
    <>
      <div className="homeCards">
        <div className="homeCard">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "1.5em" }}>{productsCount}</span>
            <i className="fa-solid fa-home fa-lg"></i>
          </div>
          <Link className="cardProductName" to="/products">
            الاصناف
          </Link>
        </div>

        <div className="homeCard">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "1.5em" }}>{categoryCount}</span>
            <i className="fa-solid fa-home fa-lg"></i>
          </div>
          <Link className="cardProductName" to="/categories">
            الاقسام
          </Link>
        </div>
      </div>
      {companyId && (
        <div>
          {campany?.companyName}
          <br />
          {campany?.address}
          <br />
          {campany?.phoneNumber}
          <br />
          <img
            src={`${process.env.REACT_APP_SERVER_URL}${campany?.image}`}
            width={300}
            height={300}
            alt=""
          />
        </div>
      )}
    </>
  );
};

export default Home;
