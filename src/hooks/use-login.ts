import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../services/auth";
import { IError, errorHandler } from "../utils/responseHandler";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useUserStore } from "../store/user-store";
import { User } from "../types/user";

interface LoginResponse {
  user: User;
}

export const useLogin = () => {
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data: LoginResponse) => {
      const user = data.user;
      setUser(user);
      toast.success(`Login successful.`);
      router.push("/chat");
    },
    onError: (error: IError) => {
      toast.error(errorHandler(error));
    },
  });

  return { mutate, isPending, isError };
};
