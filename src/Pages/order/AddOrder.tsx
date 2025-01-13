import React, { useState, useEffect } from "react";
import { IProductProps } from "../../interfaces";
import ProductService from "../../services/productService";
import "./order.css";
const AddOrder: React.FC = () => {
  const [invoiceProducts, setInvoiceProducts] = useState<IProductProps[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<IProductProps[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [products, setProducts] = useState<IProductProps[]>([]);

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
          !invoiceProducts.some((item) => item.id === product.id)
      );
      setFilteredProducts(matches);
      setHighlightedIndex(-1);
    } else {
      setFilteredProducts([]);
    }
  };

  const handleAddProduct = (product: IProductProps) => {
    if (!invoiceProducts.some((item) => item.id === product.id)) {
      setInvoiceProducts((prev) => [...prev, product]);
    }
    setSearchTerm("");
    setFilteredProducts([]);
    setHighlightedIndex(-1);
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

  // const totalAmount = useMemo(
  //   () =>
  //     invoiceProducts.reduce(
  //       (sum, product) => sum + product.price * product.quantity,
  //       0
  //     ),
  //   [invoiceProducts]
  // );

  return (
    <div style={{ textAlign: "center" }}>
      <h1>فاتورة</h1>

      <div style={{ position: "relative" }}>
        <input
          type="text"
          placeholder="ابحث عن المنتجات ......"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          className="searchInput"
          style={{ width: "500px" }}
        />
        {invoiceProducts.length >= 1 && (
          <button id="printBtn" onClick={() => window.print()}>
            طباعة
          </button>
        )}
        {filteredProducts.length > 0 && (
          <ul className="filteredProduct">
            {filteredProducts.map((product, index) => (
              <li
                key={product.id}
                style={{
                  backgroundColor:
                    highlightedIndex === index ? "#ddd" : "white",
                }}
                onClick={() => handleAddProduct(product)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {product.title}
              </li>
            ))}
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
                {/* <th>Quantity</th>
                <th>Total</th> */}
                <th className="actionCell">العمليات</th>
              </tr>
            </thead>
            <tbody>
              {invoiceProducts.map((product, index) => (
                <tr key={product.id}>
                  <td>{index + 1}</td>
                  <td style={{ width: "500px", maxWidth: "500px" }}>
                    {product.title}
                  </td>
                  <td>{product.price}</td>

                  <td className="actionCell">
                    <button
                      className="deleteInvoiceBtn"
                      onClick={() =>
                        setInvoiceProducts((prev) =>
                          prev.filter((p) => p.id !== product.id)
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
          {/* <div style={{ marginTop: "20px", fontWeight: "bold" }}>
            Total Amount: ${totalAmount.toFixed(2)}
          </div> */}
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default AddOrder;
