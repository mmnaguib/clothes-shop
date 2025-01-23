import { toast } from "react-toastify";
import { IStock } from "../interfaces";
import axiosInstance from "../utils/axiosInstance";

const ProductService = {
  getAllProgucts: async () => {
    const req = await axiosInstance
      .get("products")
      .then((res) => res.data.products)
      .catch((err) => toast.error(err));
    return req;
  },

  addNewProduct: async (
    title: string,
    description: string,
    price: number,
    image: File | null,
    categoryId: string,
    stock: IStock[]
  ) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price.toString());
    formData.append("categoryId", categoryId.toString());
    formData.append("stock", JSON.stringify(stock));

    if (image) {
      formData.append("image", image);
    }
    return await axiosInstance.post("products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  deleteProducts: async (id: string) => {
    return await axiosInstance.delete(`products/${id}`);
  },
  // editProducts: async (id: string, name: string) => {
  //   return await axiosInstance.put(`products/${id}`, { name });
  // },

  getProductsCount: async () => {
    return await axiosInstance.get(`products/count`);
  },
};

export default ProductService;
