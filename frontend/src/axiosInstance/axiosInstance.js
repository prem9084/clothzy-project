import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://clothzy-elxv.onrender.com/api/v1",
  withCredentials: true, // 🔥 This is REQUIRED for cookies to be sent
 
});

export default axiosInstance;

