import React, { useState, useEffect, useMemo } from "react";
import { IFilteredProduct, IProductProps } from "../../interfaces";
import ProductService from "../../services/productService";
import "./order.css";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddOrder: React.FC = () => {
  const navigate = useNavigate();
  const [invoiceProducts, setInvoiceProducts] = useState<
    {
      productId: string;
      title: string;
      size: string;
      color: string;
      quantity: number;
      price: number;
      total: number;
      availableQuantity: number;
    }[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<IFilteredProduct[]>(
    []
  );
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [products, setProducts] = useState<IProductProps[]>([]);
  const [customerName, setCustomerName] = useState<string>("");

  const fetchProducts = async () => {
    try {
      const res = await ProductService.getAllProgucts();
      setProducts(res);
    } catch (error) {
      console.error("خطأ في جلب المنتجات:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);

    if (term) {
      const matches = products.flatMap((product) => {
        if (product.title.toLowerCase().includes(term.toLowerCase())) {
          return product.stock
            .filter((stockItem) => stockItem.quantity > 0)
            .map((stockItem) => ({
              _id: product._id,
              creationAt: product.creationAt,
              image: product.image,
              title: product.title,
              description: product.description,
              price: product.price,
              stock: product.stock,
              categoryId: product.categoryId,
              updatedAt: product.updatedAt,
              size: stockItem.size,
              color: stockItem.color,
              quantity: stockItem.quantity,
              stockItemId: `${product._id}-${stockItem.size}-${stockItem.color}`,
              productId: product._id, // إضافة productId هنا
            }));
        }
        return [];
      });

      setFilteredProducts(matches); // تعيين المزيجات المفلترة
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
    }
  };

  const handleAddProduct = (product: {
    productId: string;
    size: string;
    color: string;
    price: number;
    quantity: number;
    title: string;
    stockItemId: string;
  }) => {
    const existingProductIndex = invoiceProducts.findIndex(
      (item) =>
        item.productId === product.productId &&
        item.size === product.size &&
        item.color === product.color
    );

    if (existingProductIndex !== -1) {
      increaseQuantity(existingProductIndex);
    } else {
      setInvoiceProducts((prev) => [
        ...prev,
        {
          productId: product.productId,
          title: product.title,
          size: product.size,
          color: product.color,
          quantity: 1,
          price: product.price,
          total: product.price,
          availableQuantity: product.quantity,
        },
      ]);
    }

    setSearchTerm("");
    setFilteredProducts([]);
    setHighlightedIndex(-1);
  };

  const increaseQuantity = (index: number) => {
    setInvoiceProducts((prev) =>
      prev.map((item, idx) =>
        idx === index
          ? {
              ...item,
              quantity: item.quantity + 1,
              total: (item.quantity + 1) * item.price,
            }
          : item
      )
    );
  };

  const decreaseQuantity = (index: number) => {
    setInvoiceProducts((prev) =>
      prev.map((item, idx) =>
        idx === index && item.quantity > 1
          ? {
              ...item,
              quantity: item.quantity - 1,
              total: (item.quantity - 1) * item.price,
            }
          : item
      )
    );
  };

  const totalAmount = useMemo(
    () => invoiceProducts.reduce((sum, item) => sum + item.total, 0),
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
      products: invoiceProducts,
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
    navigate("/orders");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>فاتورة</h1>
      <div style={{ position: "relative" }}>
        <input
          type="text"
          placeholder="اسم العميل"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          style={{
            width: "300px",
            marginBottom: "20px",
            padding: "10px",
            outline: "none",
            border: 0,
            marginLeft: "10px",
            borderRadius: "4px",
          }}
        />
        <input
          type="text"
          placeholder="ابحث عن المنتجات ......"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            width: "500px",
            marginBottom: "20px",
            padding: "10px",
            outline: "none",
            border: 0,
            marginLeft: "10px",
            borderRadius: "4px",
          }}
        />
        {filteredProducts.length > 0 && (
          <ul className="filteredProduct">
            {filteredProducts.map((product) => (
              <li
                key={product.stockItemId}
                onClick={() => handleAddProduct(product)}
              >
                {product.title} - {product.size} - {product.color} (متوفر:{" "}
                {product.quantity})
              </li>
            ))}
          </ul>
        )}
      </div>
      {invoiceProducts.length > 0 && (
        <>
          <table className="invoicesTable" border={1}>
            <thead>
              <tr>
                <th>المنتج</th>
                <th>المقاس</th>
                <th>اللون</th>
                <th>الكمية</th>
                <th>السعر</th>
                <th>الإجمالي</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {invoiceProducts.map((item, index) => (
                <tr key={index}>
                  <td>{item.title}</td>
                  <td>{item.size}</td>
                  <td>{item.color}</td>
                  <td
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "20px",
                      border: 0,
                    }}
                  >
                    <button
                      onClick={() => decreaseQuantity(index)}
                      disabled={item.quantity == 1}
                      style={{
                        cursor: item.quantity === 1 ? "not-allowed" : "pointer",
                        opacity:
                          item.quantity === item.availableQuantity ? 0.6 : 1,
                        border: 0,
                        background: "transparent",
                      }}
                    >
                      <i className="fa-solid fa-minus"></i>
                    </button>
                    {item.quantity}
                    <button
                      onClick={() => increaseQuantity(index)}
                      disabled={item.quantity === item.availableQuantity}
                      style={{
                        cursor:
                          item.quantity === item.availableQuantity
                            ? "not-allowed"
                            : "pointer",
                        opacity:
                          item.quantity === item.availableQuantity ? 0.6 : 1,
                        border: 0,
                        background: "transparent",
                      }}
                    >
                      <i className="fa-solid fa-plus"></i>
                    </button>
                  </td>
                  <td>{item.price}</td>
                  <td>{item.total.toFixed(2)}</td>
                  <td>
                    <button
                      onClick={() =>
                        setInvoiceProducts((prev) =>
                          prev.filter((_, idx) => idx !== index)
                        )
                      }
                    >
                      <i className="fa-solid fa-times"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ fontSize: "30px", textAlign: "right" }}>
            <b>
              الإجمالي: {totalAmount.toFixed(2)} جنيه{" "}
              <i className="fa-solid fa-money-bill"></i>
            </b>
          </div>
          <button onClick={saveInvoice}>حفظ الفاتورة</button>
        </>
      )}
    </div>
  );
};

export default AddOrder;
