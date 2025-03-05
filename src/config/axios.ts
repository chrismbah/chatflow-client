import axios from "axios";
// Create an axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000/api",
  withCredentials: true, // Include credentials (cookies) in requests
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.href = `/auth/login?sessionExpired=true`;
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
