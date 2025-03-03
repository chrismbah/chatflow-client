import axiosInstance from "@/config/axios";

export const getUserProfile = async () => {
  const res = await axiosInstance.get("/users/profile");
  return res.data;
};

export const getUsers = async (page: number, limit: number, search?: string) => {
  const res = await axiosInstance.get("/users", {
    params: {
      page,
      limit,
      search,
    },
  });
  return res.data.data; // Ensure the API returns { users: User[], pagination: { totalPages, totalUsers, etc. } }
};