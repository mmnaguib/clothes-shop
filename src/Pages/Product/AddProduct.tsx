import React, { useState } from "react";
import InputField from "../../Components/InputField";
import Button from "../../Components/Button";
import { ICategoryProps } from "../../interfaces";

const AddProduct = ({ categories }: { categories: ICategoryProps[] }) => {
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQunatity] = useState<number>(0);
  const [image, setImage] = useState<File | null>(null);
  const [colorId, setColorId] = useState<number>(0);
  const [sizeId, setSizeId] = useState<number>(0);
  const [categoryId, setCategoryId] = useState<number>(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImage(files[0]);
    }
  };

  const addProductHandler = async (e: React.FormEvent) => {
    e.preventDefault(); // منع إعادة تحميل الصفحة
    console.log(
      title,
      description,
      price,
      quantity,
      image,
      colorId,
      sizeId,
      categoryId
    );
    setOpenPopup(false); // إغلاق البوب أب بعد الإضافة
  };

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
                    value={colorId || ""}
                    onChange={(e) => setColorId(+e.target.value)}
                    className="input-field"
                    required
                  >
                    <option value="" disabled>
                      اختر
                    </option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: "15px" }}>
                <div className="inputFieldContainer">
                  <label className="inputFieldLabel">المقاسات المتاحة</label>
                  <select
                    value={sizeId || ""}
                    onChange={(e) => setSizeId(+e.target.value)}
                    className="input-field"
                    required
                  >
                    <option value="" disabled>
                      اختر
                    </option>
                  </select>
                </div>

                <div className="inputFieldContainer">
                  <label className="inputFieldLabel">القسم</label>
                  <select
                    value={categoryId || ""}
                    onChange={(e) => setCategoryId(+e.target.value)}
                    className="input-field"
                    required
                  >
                    <option value="" disabled>
                      اختر
                    </option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
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
