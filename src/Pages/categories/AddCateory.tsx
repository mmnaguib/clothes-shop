import React, { useState } from "react";
import InputField from "../../Components/InputField";
import Button from "../../Components/Button";
import CategoryService from "../../services/categoryService";
import { ICategoryProps } from "../../interfaces";

const AddCateory = ({
  setCategories,
}: {
  setCategories: React.Dispatch<React.SetStateAction<ICategoryProps[]>>;
}) => {
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const addNewCategory = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const res = await CategoryService.addNewCateory(name);
    console.log(res);
    setName("");
    setOpenPopup(false);
    setCategories((prevCategories: ICategoryProps[]) => [
      ...prevCategories,
      res.data.category,
    ]);
  };
  return (
    <>
      <button
        className="searchInput"
        onClick={() => setOpenPopup(true)}
        style={{ width: "50px", background: "#28a745", color: "#fff" }}
        title="اضف قسم جديد"
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
            <form onSubmit={addNewCategory}>
              <InputField
                type="text"
                label="اسم القسم"
                onChange={(e) => setName(e.target.value)}
                value={name}
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

export default AddCateory;
