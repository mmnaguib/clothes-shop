import React, { useState, useEffect, useMemo } from "react";
import { IProductProps } from "../../interfaces";
import ProductService from "../../services/productService";
import "./order.css";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
const AddOrder: React.FC = () => {
  const [invoiceProducts, setInvoiceProducts] = useState<IProductProps[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<IProductProps[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [products, setProducts] = useState<IProductProps[]>([]);
  const [customerName, setCustomerName] = useState<string>("");

  const fetchProducts = async () => {
    try {
      const res = await ProductService.getAllProgucts();
      setProducts(res);
    } catch (error) {
      console.error("خطأ في جلب المنتجات:", error);
    } finally {
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  const handleSearch = (term: string) => {
    setSearchTerm(term);

    if (term) {
      const matches = products.filter(
        (product) =>
          product.title.toLowerCase().includes(term.toLowerCase()) &&
          !invoiceProducts.some((item) => item._id === product._id)
      );
      setFilteredProducts(matches);
      setHighlightedIndex(-1);
    } else {
      setFilteredProducts([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (filteredProducts.length === 0) return;

    if (e.key === "ArrowDown") {
      setHighlightedIndex((prevIndex) =>
        prevIndex < filteredProducts.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : filteredProducts.length - 1
      );
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      handleAddProduct(filteredProducts[highlightedIndex]);
    }
  };

  const increaseQuantity = (id: string) => {
    setInvoiceProducts((prev) =>
      prev.map((product) =>
        product._id === id
          ? { ...product, quantity: product.quantity + 1 }
          : product
      )
    );
  };

  const decreaseQuantity = (id: string) => {
    setInvoiceProducts((prev) =>
      prev.map((product) =>
        product._id === id && product.quantity > 1
          ? { ...product, quantity: product.quantity - 1 }
          : product
      )
    );
  };

  const handleAddProduct = (product: IProductProps) => {
    if (!invoiceProducts.some((item) => item._id === product._id)) {
      setInvoiceProducts((prev) => [
        ...prev,
        { ...product, quantity: 1 }, // إضافة الكمية الافتراضية
      ]);
    }
    setSearchTerm("");
    setFilteredProducts([]);
    setHighlightedIndex(-1);
  };

  const totalAmount = useMemo(
    () =>
      invoiceProducts.reduce(
        (sum, product) => sum + product.price * product.quantity,
        0
      ),
    [invoiceProducts]
  );

  const saveInvoice = async () => {
    if (!customerName.trim()) {
      alert("يرجى إدخال اسم العميل.");
      return;
    }

    if (invoiceProducts.length === 0) {
      alert("يرجى إضافة منتجات إلى الفاتورة.");
      return;
    }

    const invoiceData = {
      customerName,
      products: invoiceProducts.map((product) => ({
        productId: product._id,
        title: product.title,
        quantity: product.quantity,
        price: product.price,
        total: product.quantity * product.price,
      })),
      totalAmount,
    };

    try {
      const res = await axiosInstance.post("/invoices", invoiceData);
      if (res.status === 201) {
        toast.success("تم حفظ الفاتورة");
        setCustomerName("");
        setInvoiceProducts([]);
      }
    } catch (error) {
      console.error("خطأ أثناء حفظ الفاتورة:", error);
      alert("حدث خطأ أثناء حفظ الفاتورة.");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>فاتورة</h1>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="اسم العميل"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          style={{
            width: "300px",
            marginBottom: "10px",
            padding: "8px",
            fontSize: "16px",
          }}
        />
      </div>

      <div style={{ position: "relative" }}>
        <input
          type="text"
          placeholder="ابحث عن المنتجات ......"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          className="searchInput"
          style={{ width: "500px", marginBottom: "50px" }}
        />
        {filteredProducts.length > 0 && (
          <ul className="filteredProduct">
            {filteredProducts.map((product, index) =>
              product.quantity >= 1 ? (
                <>
                  <li
                    key={product._id}
                    style={{
                      backgroundColor:
                        highlightedIndex === index ? "#ddd" : "white",
                    }}
                    onClick={() => handleAddProduct(product)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    {product.title}
                  </li>
                </>
              ) : (
                ""
              )
            )}
          </ul>
        )}
      </div>
      {invoiceProducts.length > 0 ? (
        <>
          <table border={1} className="invoicesTable">
            <thead>
              <tr>
                <th>#</th>
                <th>المنتج</th>
                <th>السعر</th>
                <th>Quantity</th>
                <th>Total</th>
                <th className="actionCell">العمليات</th>
              </tr>
            </thead>
            <tbody>
              {invoiceProducts.map((product, index) => (
                <tr key={product._id}>
                  <td>{index + 1}</td>
                  <td style={{ width: "500px", maxWidth: "500px" }}>
                    {product.title}
                  </td>
                  <td>{product.price}</td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        justifyContent: "center",
                      }}
                    >
                      <button
                        className="quantityBtn"
                        onClick={() => decreaseQuantity(product._id)}
                        style={{
                          padding: "5px 10px",
                          cursor:
                            product.quantity > 1 ? "pointer" : "not-allowed",
                        }}
                      >
                        -
                      </button>
                      <span>{product.quantity}</span>
                      <button
                        className="quantityBtn"
                        onClick={() => increaseQuantity(product._id)}
                        style={{ padding: "5px 10px", cursor: "pointer" }}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>{(product.price * product.quantity).toFixed(2)}</td>
                  <td className="actionCell">
                    <button
                      className="deleteInvoiceBtn"
                      onClick={() =>
                        setInvoiceProducts((prev) =>
                          prev.filter((p) => p._id !== product._id)
                        )
                      }
                    >
                      <span>x</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: "20px", fontWeight: "bold" }}>
            Total Amount: ${totalAmount.toFixed(2)}
          </div>

          <div style={{ marginTop: "20px" }}>
            <button
              className="invoiceSaveBtn"
              onClick={saveInvoice}
              style={{
                padding: "10px 20px",
                backgroundColor: "green",
                color: "white",
                fontSize: "16px",
                border: "none",
                cursor: "pointer",
              }}
            >
              حفظ الفاتورة
            </button>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default AddOrder;
