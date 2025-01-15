import InputField from "../../Components/InputField";
import Button from "../../Components/Button";
import CategoryService from "../../services/categoryService";
import { ICategoryProps } from "../../interfaces";

const EditCategory = ({
  setCategories,
  openEditPopup,
  setOpenEditPopup,
  setEditName,
  editName,
  editID,
}: {
  setCategories: React.Dispatch<React.SetStateAction<ICategoryProps[]>>;
  openEditPopup: boolean;
  setOpenEditPopup: (val: boolean) => void;
  setEditName: (val: string) => void;
  editName: string;
  editID: string;
}) => {
  const editCategoryHandler = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const res = await CategoryService.editCateory(editID, editName);
    setEditName("");
    setOpenEditPopup(false);
    setCategories((prevCategories: ICategoryProps[]) =>
      prevCategories.map((category) =>
        category._id === editID
          ? { ...category, ...res.data.category }
          : category
      )
    );
  };

  return (
    <>
      {openEditPopup && (
        <div className="popupContainer" onClick={() => setOpenEditPopup(false)}>
          <div
            className="addNewPopup"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <button
              className="closePopupBtn"
              onClick={() => setOpenEditPopup(false)}
            >
              <i className="fa-solid fa-times fa-lg"></i>
            </button>
            <form onSubmit={editCategoryHandler}>
              <InputField
                type="text"
                label="اسم القسم"
                onChange={(e) => setEditName(e.target.value)}
                value={editName}
                required
              />
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

export default EditCategory;
