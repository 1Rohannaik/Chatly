import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:3000/api/v1" // ✅ local (optional if unused)
      : "https://chatly-backend-so6r.onrender.com/api/v1", // ✅ live backend URL
  withCredentials: true,
});

export default axiosInstance;
