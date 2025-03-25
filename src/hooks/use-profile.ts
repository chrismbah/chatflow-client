import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../services/users";
import { useUserStore } from "../store/user-store";
import { useEffect } from "react";
import { User } from "../types";
import { USER } from "@/constants/query-keys";

interface ProfileResponse {
  data: User;
}

export const useProfile = () => {
  const setUser = useUserStore((state) => state.setUser);

  const { data, error, isLoading, refetch } = useQuery<ProfileResponse>({
    queryKey: [USER.FETCH_PROFILE], 
    queryFn: getUserProfile,
    retry: true,
  });

  // Use effect to sync Zustand state with the fetched user data
  useEffect(() => {
    if (data) {
      setUser(data.data);
    }
  }, [data, setUser]);

  return {
    user: data?.data ?? null,
    isUserError: !!error,
    isUserLoading: isLoading,
    refetch,
  };
};
