import React, { useState } from "react";
import InputField from "../../Components/InputField";
import { ICategoryProps } from "../../interfaces";

const AddProduct = ({
  categories,
}: {
  categories: { name: string; id: number }[];
}) => {
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

  return (
    <div>
      <button onClick={() => setOpenPopup(true)}>+</button>
      {openPopup && (
        <div>
          <form>
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
            <InputField
              type="file"
              label="صورة المنتج"
              onChange={handleFileChange}
              required
            />
            <select
              value={colorId || ""}
              onChange={(e) => setColorId(+e.target.value)}
              className="inputField"
              required
            >
              <option value="" disabled>
                اختر
              </option>
            </select>
            <select
              value={sizeId || ""}
              onChange={(e) => setSizeId(+e.target.value)}
              className="inputField"
              required
            >
              <option value="" disabled>
                اختر
              </option>
            </select>
            <select
              value={categoryId || ""}
              onChange={(e) => setCategoryId(+e.target.value)}
              className="inputField"
              required
            >
              <option value="" disabled>
                اختر
              </option>
              {categories.map((category) => (
                <option value={category.id}>{category.name}</option>
              ))}
            </select>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddProduct;
