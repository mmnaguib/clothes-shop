import { useCallback, useEffect, useState } from "react";
import ProductService from "../../services/productService";
import { ICategoryProps, IProductProps } from "../../interfaces";
import "./product.css";
import AddProduct from "./AddProduct";

const Products = () => {
  const [products, setProducts] = useState<IProductProps[]>([]);
  const [search, setSearch] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<IProductProps[]>([]);
  const [uiCategories, setUiCategories] = useState<ICategoryProps[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const token = localStorage.getItem("authToken")!;
  const decoded = JSON.parse(atob(token.split(".")[1]));

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res: IProductProps[] = await ProductService.getAllProgucts();
      console.log(res);
      setProducts(res);
      setFilteredProducts(res);

      const uniqueCategories = res
        .map((product: IProductProps) => product.categoryId)
        .filter(
          (category, index, self) =>
            category && self.findIndex((c) => c._id === category._id) === index
        )
        .map((category) => ({ name: category.name, _id: category._id }));

      setUiCategories(uniqueCategories);
    } catch (error) {
      console.error("خطأ في جلب المنتجات:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filterProducts = useCallback(() => {
    let filtered = products;

    // فلترة حسب البحث
    if (search.trim()) {
      filtered = filtered.filter((product: IProductProps) =>
        product.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // فلترة حسب القسم المحدد
    if (selectedCategory) {
      filtered = filtered.filter(
        (product: IProductProps) => product.categoryId.name === selectedCategory
      );
    }

    setFilteredProducts(filtered);
  }, [products, search, selectedCategory]);

  useEffect(() => {
    filterProducts();
  }, [filterProducts]);

  const deleteProduct = async (id: string) => {
    const res = await ProductService.deleteProducts(id);
    console.log(res);
    setProducts((prev) => prev.filter((p) => p._id !== res.data.product._id));
  };
  const productCard = () => {
    return filteredProducts.map((product: IProductProps) => (
      <div className="product-card" key={product._id}>
        <img
          src={`${process.env.REACT_APP_SERVER_URL}${product?.image}`}
          alt=""
          width={"100%"}
          height={"100%"}
        />
        <b>السعر : ${product.price}</b>
        <b>المنتج : {product.title}</b>
        <b>القسم : {product.categoryId.name}</b>
        <b>الكمية المتاحة : {product.quantity}</b>
        <b style={{ display: "flex", gap: "15px" }}>
          الالوان المتاحة :
          {product.colorId.map((color) => (
            <span
              style={{
                width: "30px",
                height: "30px",
                display: "block",
                background: color,
              }}
            ></span>
          ))}
        </b>
        <b style={{ display: "flex", gap: "15px" }}>
          المقاسات المتاحة :
          {product.sizeId.map((size) => (
            <span
              style={{
                width: "30px",
                height: "30px",
                display: "block",
                border: "1px solid #f00",
                textAlign: "center",
              }}
            >
              {size}
            </span>
          ))}
        </b>
        {decoded.isAdmin && (
          <button onClick={() => deleteProduct(product._id)}>
            <i className="fa-solid fa-times"></i>
          </button>
        )}
      </div>
    ));
  };

  return loading ? (
    <div className="loader-overlay visible">
      <div className="loader">Loading...</div>
    </div>
  ) : (
    <>
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "15px",
          justifyContent: "center",
          marginTop: "70px",
        }}
      >
        {/* البحث في المنتجات */}
        <input
          type="search"
          placeholder="ابحث عن المنتجات ......"
          className="searchInput"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* البحث في الأقسام */}
        <select
          onChange={(e) => setSelectedCategory(e.target.value)}
          value={selectedCategory}
          className="searchInput"
        >
          <option value="">جميع الأقسام</option>
          {uiCategories.map((category) => (
            <option key={category._id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>

        <AddProduct setProducts={setProducts} />
      </div>

      {/* ظهور المنتجات المفلترة */}
      <div className="productCards">
        {filteredProducts.length > 0
          ? productCard()
          : "لا يوجد منتج بهذا الاسم"}
      </div>
    </>
  );
};

export default Products;
