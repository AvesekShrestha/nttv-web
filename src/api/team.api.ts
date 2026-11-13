import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { api } from "@/lib/axios";

import type {
  TeamResponseDTO,
  TeamDetailResponseDTO,
  TeamCreateDTO,
  TeamUpdateDTO,
  TeamQueryDTO,
  BulkTeamRequestDTO,
} from "@/types/team.type";

import type { PaginatedResponse } from "@/types/pagination.type";

export const fetchTeams = async (
  query: TeamQueryDTO
): Promise<PaginatedResponse<TeamDetailResponseDTO>> => {
  const response = await api.get<
    PaginatedResponse<TeamDetailResponseDTO>
  >("/team/", {
    params: {
      page: query.page,
      limit: query.limit,
      category_id: query.category_id || undefined,
      level: query.level || undefined,
      is_active: query.is_active,
      search: query.search?.trim() || undefined,
      sort_by: query.sort_by,
      sort_order: query.sort_order,
    },
  });

  return response.data;
};

export const useTeamsQuery = (query: TeamQueryDTO) => {
  return useQuery({
    queryKey: ["teams", "list", query],
    queryFn: () => fetchTeams(query),
    placeholderData: (previousData) => previousData,
  });
};

// ============================================
// Fetch Team By ID
// ============================================

export const fetchTeamById = async (
  id: string
): Promise<TeamDetailResponseDTO> => {
  const response = await api.get<TeamDetailResponseDTO>(
    `/team/${id}`
  );

  return response.data;
};

export const useTeamDetailQuery = (id: string) => {
  return useQuery({
    queryKey: ["teams", "detail", id],
    queryFn: () => fetchTeamById(id),
    enabled: !!id,
  });
};

// ============================================
// Fetch Teams By IDs
// ============================================

export const fetchTeamsBulk = async (
  payload: BulkTeamRequestDTO
): Promise<TeamDetailResponseDTO[]> => {
  const response = await api.post<TeamDetailResponseDTO[]>(
    "/team/bulk",
    payload
  );

  return response.data;
};

export const useTeamsBulkQuery = (teamIds: string[]) => {
  return useQuery({
    queryKey: ["teams", "bulk", teamIds],
    queryFn: () => fetchTeamsBulk({ team_ids: teamIds }),
    enabled: teamIds.length > 0,
  });
};

// ============================================
// Create Team
// ============================================

export const useCreateTeamMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      payload: TeamCreateDTO
    ): Promise<TeamResponseDTO> => {
      const response = await api.post<TeamResponseDTO>(
        "/team/",
        payload
      );

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teams", "list"],
      });
    },
  });
};

// ============================================
// Update Team
// ============================================

export const useUpdateTeamMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: TeamUpdateDTO;
    }): Promise<TeamDetailResponseDTO> => {
      const response = await api.patch<TeamDetailResponseDTO>(
        `/team/${id}`,
        payload
      );

      return response.data;
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["teams", "list"],
      });

      queryClient.invalidateQueries({
        queryKey: ["teams", "detail", variables.id],
      });
    },
  });
};

// ============================================
// Delete Team
// ============================================

export const useDeleteTeamMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<boolean> => {
      const response = await api.delete<boolean>(
        `/team/${id}`
      );

      return response.data;
    },

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["teams", "list"],
      });

      queryClient.removeQueries({
        queryKey: ["teams", "detail", id],
      });
    },
  });
};

// ============================================
// Add Team Member
// ============================================

export const useAddTeamMemberMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      teamId,
      memberId,
    }: {
      teamId: string;
      memberId: string;
    }): Promise<TeamDetailResponseDTO> => {
      const response = await api.post<TeamDetailResponseDTO>(
        `/team/${teamId}/member/${memberId}`
      );

      return response.data;
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["teams", "list"],
      });

      queryClient.invalidateQueries({
        queryKey: ["teams", "detail", variables.teamId],
      });
    },
  });
};

// ============================================
// Remove Team Member
// ============================================

export const useRemoveTeamMemberMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      teamId,
      memberId,
    }: {
      teamId: string;
      memberId: string;
    }): Promise<TeamDetailResponseDTO> => {
      const response = await api.delete<TeamDetailResponseDTO>(
        `/team/${teamId}/member/${memberId}`
      );

      return response.data;
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["teams", "list"],
      });

      queryClient.invalidateQueries({
        queryKey: ["teams", "detail", variables.teamId],
      });
    },
  });
};
