import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://chatly-backend-tqn8.onrender.com/api/v1",
  withCredentials: true,
});

export default axiosInstance;
