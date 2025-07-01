import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true, // 🔥 This is REQUIRED for cookies to be sent
 
});

export default axiosInstance;

