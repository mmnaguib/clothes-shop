import React, { useCallback, useEffect, useState } from "react";
import InputField from "../../Components/InputField";
import Button from "../../Components/Button";
import { ICategoryProps, IProductProps } from "../../interfaces";
import CategoryService from "../../services/categoryService";
import ProductService from "../../services/productService";
import { productColors, productSizes } from "../../data";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

const AddProduct = ({
  setProducts,
}: {
  setProducts: React.Dispatch<React.SetStateAction<IProductProps[]>>;
}) => {
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [image, setImage] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState<string>("");
  const [categories, setCategories] = useState<ICategoryProps[]>([]);
  const [stock, setStock] = useState<
    { size: string; color: string; quantity: number }[]
  >([]);
  const [newStockEntry, setNewStockEntry] = useState<{
    size: string;
    color: string;
    quantity: number;
  }>({
    size: "",
    color: "",
    quantity: 1,
  });

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
    } else {
      setImage(null);
    }
  };

  const handleAddStockEntry = () => {
    if (
      newStockEntry.size &&
      newStockEntry.color &&
      newStockEntry.quantity > 0
    ) {
      const exists = stock.some(
        (item) =>
          item.size === newStockEntry.size && item.color === newStockEntry.color
      );
      if (exists) {
        toast.warning("هذا الإدخال موجود بالفعل في المخزون!");
        return;
      }
      setStock([...stock, newStockEntry]);
      setNewStockEntry({ size: "", color: "", quantity: 1 });
    }
  };

  const addProductHandler = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const res = await ProductService.addNewProduct(
      title,
      description,
      price,
      image,
      categoryId,
      stock // إرسال بيانات الـ stock
    );

    setProducts((prevProducts: IProductProps[]) => [
      ...prevProducts,
      res.data.product,
    ]);

    toast.success("تمت إضافة المنتج بنجاح!");

    setTitle("");
    setDescription("");
    setPrice(0);
    setImage(null);
    setCategoryId("");
    setStock([]);
    setOpenPopup(false);
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      if (!event.target) {
        console.error("حدث خطأ أثناء قراءة الملف");
        return;
      }

      // قراءة البيانات من الملف
      const data = new Uint8Array(event.target.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0]; // اسم أول شيت
      const sheet = workbook.Sheets[sheetName];

      // تحويل بيانات الشيت إلى JSON
      const jsonData: {
        title: string;
        description: string;
        price: number;
        categoryId: string;
        size: string;
        color: string;
        quantity: number;
        imageUrl: File;
      }[] = XLSX.utils.sheet_to_json(sheet);

      for (const product of jsonData) {
        try {
          const res = await ProductService.addNewProduct(
            product.title,
            product.description,
            product.price,
            product.imageUrl,
            product.categoryId,
            [
              {
                size: product.size,
                color: product.color,
                quantity: product.quantity,
              },
            ]
          );

          setProducts((prevProducts) => [...prevProducts, res.data.product]);
          alert("تمت إضافة المنتجات بنجاح!");
          setOpenPopup(false);
        } catch (error) {
          console.error(`خطأ أثناء إضافة المنتج: ${product.title}`, error);
        }
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <>
      <button
        className="searchInput"
        onClick={() => setOpenPopup(true)}
        style={{ width: "50px", background: "#28a745", color: "#fff" }}
        title="اضف منتج جديد"
      >
        <i className="fa-solid fa-plus fa-lg"></i>
      </button>
      <form onSubmit={addProductHandler}>
        <div className="upload-button-container">
          <label htmlFor="uploadExcel" className="upload-button">
            <i className="fa-solid fa-file-excel"></i> ارفع المنتجات (Excel)
            <input
              type="file"
              id="uploadExcel"
              accept=".xlsx, .xls"
              onChange={handleExcelUpload}
            />
          </label>
        </div>
      </form>
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
                  label="كود المنتج"
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
                  type="file"
                  label="صورة المنتج"
                  onChange={handleFileChange}
                />
              </div>
              <div
                style={{
                  border: "1px solid #eaeaea",
                  padding: "5px 10px",
                }}
              >
                <h4 style={{ margin: 0 }}>إدارة المخزون:</h4>
                <div className="stockContent">
                  <div>
                    <select
                      value={newStockEntry.size}
                      onChange={(e) =>
                        setNewStockEntry((prev) => ({
                          ...prev,
                          size: e.target.value,
                        }))
                      }
                    >
                      <option value="" disabled>
                        اختر المقاس
                      </option>
                      {productSizes.map((size) => (
                        <option key={size.value} value={size.value}>
                          {size.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <select
                      value={newStockEntry.color}
                      onChange={(e) =>
                        setNewStockEntry((prev) => ({
                          ...prev,
                          color: e.target.value, // سيحفظ Hex code هنا
                        }))
                      }
                    >
                      <option value="" disabled>
                        اختر اللون
                      </option>
                      {productColors.map((color) => (
                        <option key={color.hex} value={color.hex}>
                          {color.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="ادخل الكمية"
                      onChange={(e) =>
                        setNewStockEntry((prev) => ({
                          ...prev,
                          quantity: +e.target.value,
                        }))
                      }
                      value={newStockEntry.quantity}
                      min={1}
                    />
                  </div>
                  ,
                  <div>
                    <button
                      type="button"
                      onClick={handleAddStockEntry}
                      style={{
                        background: "#28a745",
                        color: "#fff",
                        padding: "5px 10px",
                        border: "none",
                        borderRadius: "5px",
                      }}
                    >
                      أضف
                    </button>
                  </div>
                </div>
                <ul>
                  {stock.map((item, index) => (
                    <li key={index}>
                      {item.size} - {item.color} - {item.quantity}
                    </li>
                  ))}
                </ul>
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
              <div className="addProductBtn">
                <Button type="submit" label="أضف منتج" />
                <i className="fa-solid fa-plus fa-lg"></i>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddProduct;
