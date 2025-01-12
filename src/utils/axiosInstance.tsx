import axios, { AxiosInstance } from "axios";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: `https://api.escuelajs.co/api/v1/`,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
