import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../services/auth";
import { IError, errorHandler } from "../utils/responseHandler";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserStore } from "../store/user-store";
import { User } from "../types";
import { useEffect } from "react";

interface LoginResponse {
  user: User;
}

export const useLogin = () => {
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handle session expiration notification on login page
  useEffect(() => {
    const sessionExpired = searchParams.get("sessionExpired");

    if (sessionExpired) {
      toast.error("Your session has expired. Please log in again.");
    }
  }, [searchParams]);

  const { mutate, isPending, isError } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data: LoginResponse) => {
      const user = data.user;
      setUser(user);
      router.push("/chat");
      toast.success(`Login successful.`);
    },
    onError: (error: IError) => {
      toast.error(errorHandler(error));
    },
  });

  return { mutate, isPending, isError };
};
