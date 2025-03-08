import { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { getUsers } from "@/services/users";
import { USERS } from "@/constants/query-keys";
export const useUsers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const {
    data,
    error: isUsersError,
    isLoading: isFetchingUsers,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: [USERS.FETCH_USERS, debouncedSearchQuery],
    queryFn: ({ pageParam = 1 }) =>
      getUsers(pageParam, 10, debouncedSearchQuery),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage?.pagination?.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined,
  });

  useEffect(() => {
    refetch();
  }, [debouncedSearchQuery, refetch]);

  return {
    users: data?.pages.flatMap((page) => page.users) || [],
    isUsersError,
    isFetchingUsers,
    fetchNextPage,
    hasNextPage,
    refetch,
    debouncedSearchQuery,
    searchQuery,
    handleSearch,
  };
};
