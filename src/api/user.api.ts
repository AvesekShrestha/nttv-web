import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type {
  UserResponseDTO,
  CreateStaffDTO,
  UserQueryDTO,
} from "@/types/user.type";
import type { PaginatedResponse } from "@/types/pagination.type";
import type { AuthUser } from "@/types/auth.type";

export const fetchUsers = async (
  query: UserQueryDTO
): Promise<PaginatedResponse<UserResponseDTO>> => {
  const response = await api.get<PaginatedResponse<UserResponseDTO>>("/user/", {
    params: {
      page: query.page,
      limit: query.limit,
      role: query.role || undefined,
      level: query.level || undefined,
      is_active: query.is_active,
      search: query.search?.trim() || undefined,
    },
  });

  return response.data;
};

export const useUsersQuery = (query: UserQueryDTO) => {
  return useQuery({
    queryKey: ["users", "list", query],
    queryFn: () => fetchUsers(query),
    placeholderData: (previousData) => previousData,
  });
};

export const fetchUserById = async (id: string): Promise<UserResponseDTO> => {
  const response = await api.get<UserResponseDTO>(`/user/${id}`);
  return response.data;
};

export const useUserDetailQuery = (id: string) => {
  return useQuery({
    queryKey: ["users", "detail", id],
    queryFn: () => fetchUserById(id),
    enabled: !!id,
  });
};

export const fetchCurrentUser = async (): Promise<AuthUser> => {
  const response = await api.get<AuthUser>("/user/me");
  return response.data;
};

export const useCurrentUserQuery = () => {
  return useQuery({
    queryKey: ["users", "me"],
    queryFn: fetchCurrentUser,
  });
};

export const useCreateStaffMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateStaffDTO): Promise<UserResponseDTO> => {
      const response = await api.post<UserResponseDTO>("/user/", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users", "list"],
      });
    },
  });
};
