import axiosInstance from "../utils/axiosInstance";

const ProductService = {
  getAllProgucts: async () => {
    const req = await axiosInstance
      .get("products")
      .then((res) => res.data.products)
      .catch((err) => console.log(err));
    return req;
  },

  addNewProduct: async (
    title: string,
    description: string,
    price: number,
    quantity: number,
    image: File | null,
    colorIds: string[],
    sizeIds: string[],
    categoryId: string
  ) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price.toString());
    formData.append("quantity", quantity.toString());
    formData.append("categoryId", categoryId.toString());
    formData.append("colorId", JSON.stringify(colorIds));
    formData.append("sizeId", JSON.stringify(sizeIds));

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
};

export default ProductService;
