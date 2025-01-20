import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../services/users";
import { useUserStore } from "../store/user-store";
import { useEffect } from "react";
import { User } from "../types/user";

interface ProfileResponse {
  user: User;
}

export const useProfile = () => {
  const setUser = useUserStore((state) => state.setUser);

  const { data, error, isLoading, refetch } = useQuery<ProfileResponse>({
    queryKey: ["getUserProfile"],
    queryFn: getUserProfile,
  });

  // Use effect to sync Zustand state with the fetched user data
  useEffect(() => {
    if (data?.user) {
      setUser(data.user);
    }
  }, [data, setUser]);

  return {
    user: data?.user ?? null,
    isError: !!error,
    isLoading,
    refetch,
  };
};
