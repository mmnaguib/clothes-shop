import axiosInstance from "../utils/axiosInstance";

const ProductService = {
  getAllProgucts: async () => {
    const req = await axiosInstance
      .get("products")
      .then((res) => res.data)
      .catch((err) => console.log(err));
    return req;
  },
};

export default ProductService;
