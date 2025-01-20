import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../services/auth";
import { IError, errorHandler } from "../utils/responseHandler";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useUserStore } from "../store/user-store";
import { User } from "../types/user";

interface SignupResponse {
  user: User;
  token: string;
}

export const useSignup = () => {
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data: SignupResponse) => {
      const user = data.user;
      setUser(user);
      toast.success(`Registration successful.`);
      router.push("/chat");
    },
    onError: (error: IError) => {
      toast.error(errorHandler(error));
    },
  });

  return { mutate, isPending, isError };
};
