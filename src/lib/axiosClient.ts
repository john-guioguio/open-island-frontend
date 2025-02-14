import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://test.openisland.ph",
  withCredentials: true, // ✅ Needed for CSRF and authentication
});

export default axiosClient;
