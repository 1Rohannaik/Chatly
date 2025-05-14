import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/v1", // Always use local backend
  withCredentials: true, // Send cookies with requests
});

export default axiosInstance;
