import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000/api",
  withCredentials: true, // Include credentials (cookies) in requests
});

export default axiosInstance;
