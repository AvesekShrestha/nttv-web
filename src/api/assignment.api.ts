import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type {
  AssignmentResponseDTO,
  ClaimEligibilityResponse,
  AssignmentQueryDTO
} from "@/types/assignment.type";
import type { PaginatedResponse } from "@/types/pagination.type";

export const fetchAssignmentById = async (assignmentId: string): Promise<AssignmentResponseDTO> => {
  const response = await api.get<AssignmentResponseDTO>(`/assignment/${assignmentId}`);
  return response.data;
};

export const fetchAssignments = async (query?: AssignmentQueryDTO): Promise<PaginatedResponse<AssignmentResponseDTO>> => {
  const response = await api.get<PaginatedResponse<AssignmentResponseDTO>>(`/assignment`, {
    params: {
      page: query?.page,
      limit: query?.limit,
      status: query?.status && query.status !== 'all' ? query.status : undefined,
      ticket_id: query?.ticket_id,
    },
  });
  return response.data;
};

export const checkClaimEligibility = async (assignmentId: string): Promise<ClaimEligibilityResponse> => {
  const response = await api.get<ClaimEligibilityResponse>(`/assignment/${assignmentId}/claim-eligibility`);
  return response.data;
};

export const useAssignmentDetailQuery = (assignmentId: string | undefined) => {
  return useQuery({
    queryKey: ["assignment", assignmentId],
    queryFn: () => fetchAssignmentById(assignmentId!),
    enabled: !!assignmentId,
  });
};

export const useAssignmentsQuery = (query?: AssignmentQueryDTO) => {
  return useQuery({
    queryKey: ["assignments", query],
    queryFn: () => fetchAssignments(query),
    placeholderData: (previousData) => previousData,
  });
};

export const useClaimEligibilityQuery = (assignmentId: string | undefined) => {
  return useQuery({
    queryKey: ["claim-eligibility", assignmentId],
    queryFn: () => checkClaimEligibility(assignmentId!),
    enabled: !!assignmentId,
  });
};
