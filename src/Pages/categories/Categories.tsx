import { useCallback, useEffect, useState } from "react";
import { ICategoryProps } from "../../interfaces";
import CategoryService from "../../services/categoryService";
import AddCateory from "./AddCateory";
import EditCategory from "./EditCategory";

const Categories = () => {
  const [categories, setCategories] = useState<ICategoryProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openEditPopup, setOpenEditPopup] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>("");
  const [editID, setEditID] = useState<string>("");
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res: ICategoryProps[] = await CategoryService.getAllCategories();
      setCategories(res);
    } catch (error) {
      console.error("خطأ في جلب الاقسام:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCategory = async (_id: string) => {
    const res = await CategoryService.deleteCateory(_id);
    setCategories((prev) => prev.filter((p) => p._id !== res.data.id));
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const onEditButtonClick = (category: ICategoryProps) => {
    setEditID(category._id);
    setEditName(category.name);
    setOpenEditPopup(true);
  };

  return loading ? (
    <div className="loader-overlay visible">
      <div className="loader">Loading...</div>
    </div>
  ) : (
    <>
      <AddCateory setCategories={setCategories} />
      <EditCategory
        setCategories={setCategories}
        openEditPopup={openEditPopup}
        setOpenEditPopup={setOpenEditPopup}
        setEditName={setEditName}
        editName={editName}
        editID={editID}
      />
      <table border={1} className="invoicesTable">
        <thead>
          <tr>
            <th>#</th>
            <th>القسم</th>
            <th className="actionCell">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={category._id}>
              <td>{index + 1}</td>
              <td style={{ width: "500px", maxWidth: "500px" }}>
                {category.name}
              </td>

              <td className="actionCell">
                <button
                  style={{ background: "#f00" }}
                  className="InvoiceTableBtn"
                  onClick={() => deleteCategory(category._id)}
                >
                  <i className="fa-solid fa-times fa-lg"></i>
                </button>
                <button
                  style={{ background: "#666" }}
                  className="InvoiceTableBtn"
                  onClick={() => onEditButtonClick(category)}
                >
                  <i className="fa-solid fa-edit fa-lg"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Categories;
