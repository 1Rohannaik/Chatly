import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://chatly-backend-8viu.onrender.com/api/v1",
  withCredentials: true,
});

export default axiosInstance;
