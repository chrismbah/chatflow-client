import axiosInstance from "@/config/axios";

export const getUserProfile = async ()=>{
    const { data: response } = await axiosInstance.get("/users/profile");
    return response.data;
}