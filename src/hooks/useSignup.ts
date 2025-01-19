import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../services/auth";
import { IError, errorHandler } from "../utils/responseHandler";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export const useSignup = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { mutate, isPending, isError } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      const user = data?.user;
      setUser(user);
      localStorage.setItem("accessToken", data?.token);
      console.log(data);
      toast.success(`Registeration successful.`);
      router.push("/chats");
    },
    onError: (error: IError) => {
      toast.error(errorHandler(error));
      console.log(error);
    },
  });

  return { mutate, isPending, isError, user };
};
