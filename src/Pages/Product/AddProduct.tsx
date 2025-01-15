import React, { useCallback, useEffect, useState } from "react";
import InputField from "../../Components/InputField";
import Button from "../../Components/Button";
import { ICategoryProps, IProductProps } from "../../interfaces";
import CategoryService from "../../services/categoryService";
import ProductService from "../../services/productService";

const AddProduct = ({
  setProducts,
}: {
  setProducts: React.Dispatch<React.SetStateAction<IProductProps[]>>;
}) => {
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQunatity] = useState<number>(0);
  const [image, setImage] = useState<File | null>(null);
  const [colorIds, setColorIds] = useState<string[]>([]);
  const [sizeIds, setSizeIds] = useState<string[]>([]);
  const [categoryId, setCategoryId] = useState<string>("");
  const [categories, setCategories] = useState<ICategoryProps[]>([]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await CategoryService.getAllCategories();
      setCategories(res);
    } catch (error) {
      console.error("خطأ في جلب الاقسام:", error);
    }
  }, []);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImage(files[0]);
    }
  };

  const addProductHandler = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log(
      title,
      description,
      price,
      quantity,
      image,
      colorIds,
      sizeIds,
      categoryId
    );

    const res = await ProductService.addNewProduct(
      title,
      description,
      price,
      quantity,
      image,
      colorIds,
      sizeIds,
      categoryId
    );

    setProducts((prevProducts: IProductProps[]) => [
      ...prevProducts,
      res.data.product,
    ]);

    console.log(res);

    setOpenPopup(false);
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div>
      <button
        className="searchInput"
        onClick={() => setOpenPopup(true)}
        style={{ width: "50px", background: "#28a745", color: "#fff" }}
        title="اضف منتج جديد"
      >
        <i className="fa-solid fa-plus fa-lg"></i>
      </button>
      {openPopup && (
        <div className="popupContainer" onClick={() => setOpenPopup(false)}>
          <div
            className="addNewPopup"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <button
              className="closePopupBtn"
              onClick={() => setOpenPopup(false)}
            >
              <i className="fa-solid fa-times fa-lg"></i>
            </button>
            <form onSubmit={addProductHandler}>
              <div style={{ display: "flex", gap: "15px" }}>
                <InputField
                  type="text"
                  label="اسم المنتج"
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                  required
                />
                <InputField
                  type="text"
                  label="وصف المنتج"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                  required
                />
              </div>
              <div style={{ display: "flex", gap: "15px" }}>
                <InputField
                  type="number"
                  label="سعر المنتج"
                  onChange={(e) => setPrice(+e.target.value)}
                  value={price}
                  required
                  min={1}
                />
                <InputField
                  type="number"
                  label="الكمية المتاحة"
                  onChange={(e) => setQunatity(+e.target.value)}
                  value={quantity}
                  required
                  min={1}
                  step={1}
                />
              </div>
              <div style={{ display: "flex", gap: "15px" }}>
                <InputField
                  type="file"
                  label="صورة المنتج"
                  onChange={handleFileChange}
                  required
                />
                <div className="inputFieldContainer">
                  <label className="inputFieldLabel">الالوان المتاحة</label>
                  <select
                    multiple
                    value={colorIds || ""}
                    onChange={(e) => {
                      const selectedColors = Array.from(
                        e.target.selectedOptions,
                        (option) => option.value
                      );
                      setColorIds(selectedColors);
                    }}
                    className="input-field"
                    required
                  >
                    <option value="" disabled>
                      اختر
                    </option>
                    <option value="#f00">Red</option>
                    <option value="#080">Green</option>
                    <option value="#000">Black</option>
                    <option value="#00f">Blue</option>
                    <option value="Brown">Brown</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: "15px" }}>
                <div className="inputFieldContainer">
                  <label className="inputFieldLabel">المقاسات المتاحة</label>
                  <select
                    multiple
                    value={sizeIds || ""}
                    onChange={(e) => {
                      const selectedSizes = Array.from(
                        e.target.selectedOptions,
                        (option) => option.value
                      );
                      setSizeIds(selectedSizes);
                    }}
                    className="input-field"
                    required
                  >
                    <option value="" disabled>
                      اختر
                    </option>
                    <option value="sm">Sm</option>
                    <option value="m">Medium</option>
                    <option value="l">Large</option>
                    <option value="xl">XLarge</option>
                    <option value="2xl">2XLarge</option>
                  </select>
                </div>

                <div className="inputFieldContainer">
                  <label className="inputFieldLabel">القسم</label>
                  <select
                    value={categoryId || ""}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="input-field"
                    required
                  >
                    <option value="" disabled>
                      اختر
                    </option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="addProductBtn">
                <Button type="submit" label="أضف منتج" />
                <i className="fa-solid fa-plus fa-lg"></i>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProduct;
