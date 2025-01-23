import { useCallback, useEffect, useState } from "react";
import ProductService from "../../services/productService";
import { ICategoryProps, IProductProps } from "../../interfaces";
import "./product.css";
import AddProduct from "./AddProduct";
import { formatPrice } from "../../utils/MoneyFormat";

const Products = () => {
  const [products, setProducts] = useState<IProductProps[]>([]);
  const [search, setSearch] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<IProductProps[]>([]);
  const [uiCategories, setUiCategories] = useState<ICategoryProps[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const token = localStorage.getItem("tiaStoreToken")!;
  const decoded = JSON.parse(atob(token.split(".")[1]));

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res: IProductProps[] = await ProductService.getAllProgucts();
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

    // filtered = filtered.filter((product: IProductProps) =>
    //   product.stock.some((item) => item.quantity > 0)
    // );

    setFilteredProducts(filtered);
  }, [products, search, selectedCategory]);

  useEffect(() => {
    filterProducts();
  }, [filterProducts]);

  const deleteProduct = async (id: string) => {
    const res = await ProductService.deleteProducts(id);
    setProducts((prev) => prev.filter((p) => p._id !== res.data.product._id));
  };

  const productCard = () => {
    return filteredProducts.map((product: IProductProps) => (
      <div className="product-card" key={product._id}>
        <div>
          <img
            src={`${process.env.REACT_APP_SERVER_URL}${product?.image}`}
            alt=""
            width={"100%"}
            height={"100%"}
          />
        </div>
        <div>
          <b className="productPrice">{formatPrice(product.price)}</b>
          <b className="productTitle">{product.title}</b>
          <table
            border={1}
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "20px",
              backgroundColor: "#f7f7f7",
            }}
          >
            <thead>
              <tr>
                <th>المقاس</th>
                <th>اللون</th>
                <th>الكمية</th>
              </tr>
            </thead>
            <tbody>
              {product.stock.map((item, index) => (
                <tr>
                  <td>{item.size}</td>
                  <td>
                    <span
                      style={{
                        display: "block",
                        height: "30px",
                        width: "80%",
                        margin: "auto",
                        backgroundColor: item.color,
                      }}
                    ></span>
                  </td>
                  <td>{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <b
            style={{ margin: "10px 0", textAlign: "left" }}
            onClick={() => setSelectedCategory(product.categoryId.name)}
          >
            {product.categoryId.name}
          </b>
          {decoded.isAdmin && (
            <button
              className="removeProductBtn"
              onClick={() => deleteProduct(product._id)}
            >
              <i className="fa-solid fa-times"></i>
            </button>
          )}
        </div>
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
          alignItems: "center",
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
