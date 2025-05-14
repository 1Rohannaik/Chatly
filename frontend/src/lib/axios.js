import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:3000/api/v1" // Local development URL
      : "https://chatly-backend-so6r.onrender.com/api/v1", // Live production URL
  withCredentials: true, // Ensure cookies are sent with requests
});


export default axiosInstance;
