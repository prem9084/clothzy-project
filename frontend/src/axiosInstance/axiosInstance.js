import axios from "axios";
// https://clothzy-elxv.onrender.com
const axiosInstance = axios.create({
  baseURL: "https://clothzy-elxv.onrender.com/api/v1",
  withCredentials: true, // 🔥 This is REQUIRED for cookies to be sent
 
});

export default axiosInstance;

