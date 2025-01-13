import axiosInstance from "../utils/axiosInstance";

const CategoryService = {
  getAllCategories: async () => {
    const req = await axiosInstance
      .get("categories")
      .then((res) => res.data)
      .catch((err) => console.log(err));
    return req;
  },
};

export default CategoryService;
