import axiosInstance from "../utils/axiosInstance";

const CategoryService = {
  getAllCategories: async () => {
    const req = await axiosInstance
      .get("categories")
      .then((res) => res.data)
      .catch((err) => console.log(err));
    return req;
  },

  addNewCateory: async (name: string) => {
    return await axiosInstance.post("categories", { name });
  },
  deleteCateory: async (id: string) => {
    return await axiosInstance.delete(`categories/${id}`);
  },
  editCateory: async (id: string) => {
    return await axiosInstance.put(`categories/${id}`);
  },
};

export default CategoryService;
