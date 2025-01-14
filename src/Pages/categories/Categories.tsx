import { useCallback, useEffect, useState } from "react";
import { ICategoryProps } from "../../interfaces";
import CategoryService from "../../services/categoryService";
import AddCateory from "./AddCateory";

const Categories = () => {
  const [categories, setCategories] = useState<ICategoryProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
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
    console.log(res);
    setCategories((prev) => prev.filter((p) => p._id !== res.data.id));
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return loading ? (
    <div className="loader-overlay visible">
      <div className="loader">Loading...</div>
    </div>
  ) : (
    <>
      <AddCateory setCategories={setCategories} />
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
                  className="deleteInvoiceBtn"
                  onClick={() => deleteCategory(category._id)}
                >
                  <span>x</span>
                </button>
                <button
                  className="deleteInvoiceBtn"
                  onClick={() => deleteCategory(category._id)}
                >
                  <span>edit</span>
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
