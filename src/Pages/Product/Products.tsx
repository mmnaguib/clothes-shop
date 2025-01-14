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

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res: IProductProps[] = await ProductService.getAllProgucts();
      setProducts(res);
      setFilteredProducts(res);

      const uniqueCategories = res
        .map((product: IProductProps) => product.category)
        .filter(
          (category, index, self) =>
            category && self.findIndex((c) => c.id === category.id) === index
        )
        .map((category) => ({ name: category.name, id: category.id }));

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
        (product: IProductProps) => product.category.name === selectedCategory
      );
    }

    setFilteredProducts(filtered);
  }, [products, search, selectedCategory]);

  useEffect(() => {
    filterProducts();
  }, [filterProducts]);

  // عرض كارد المنتج
  const productCard = () => {
    return filteredProducts.map((product: IProductProps) => (
      <div className="product-card" key={product.id}>
        <img src={product.images[0]} alt="" width={"100%"} />
        <b>${product.price}</b>
        <b>{product.title}</b>
        <b>القسم : {product.category.name}</b>
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
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>

        <AddProduct />
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
