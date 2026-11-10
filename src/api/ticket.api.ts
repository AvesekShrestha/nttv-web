import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { TicketResponseDTO, TicketQueryDTO, TicketCreateDTO } from "@/types/ticket.type";
import type { ReassignmentDTO, AssignmentResponseDTO } from "@/types/assignment.type";
import type { PaginatedResponse } from "@/types/pagination.type";


export const fetchTickets = async (query: TicketQueryDTO): Promise<PaginatedResponse<TicketResponseDTO>> => {
  const response = await api.get<PaginatedResponse<TicketResponseDTO>>('/ticket/', {
    params: {
      page: query.page,
      limit: query.limit,
      status: query.status && query.status !== 'all' ? query.status : undefined,
      priority: query.priority && query.priority !== 'all' ? query.priority : undefined,
      category_id: query.category_id && query.category_id !== "all" ? query.category_id : undefined,
      user_id: query.user_id,
      search: query.search?.trim() || undefined,
    },
  });

  return response.data;
};

export const fetchTicketById = async (id: string): Promise<TicketResponseDTO> => {
  const response = await api.get<TicketResponseDTO>(`/ticket/${id}`);
  return response.data;
};

export const fetchTicketAssignments = async (ticketId: string): Promise<AssignmentResponseDTO[]> => {
  const response = await api.get<AssignmentResponseDTO[]>(`/ticket/${ticketId}/assignments`);
  return response.data;
};

export const createTicket = async (payload: TicketCreateDTO): Promise<TicketResponseDTO> => {
  const response = await api.post<TicketResponseDTO>('/ticket/', payload);
  return response.data;
};

export const deleteTicket = async (id: string): Promise<boolean> => {
  const response = await api.delete<boolean>(`/ticket/${id}`);
  return response.data;
};

export const acknowledgeTicket = async (id: string): Promise<TicketResponseDTO> => {
  // Matching FastAPI backend spelling: /acknowldege
  const response = await api.post<TicketResponseDTO>(`/ticket/${id}/acknowldege`);
  return response.data;
};

export const completeTicket = async (id: string): Promise<TicketResponseDTO> => {
  const response = await api.post<TicketResponseDTO>(`/ticket/${id}/complete`);
  return response.data;
};

export const forwardTicket = async ({ id, payload }: { id: string; payload: ReassignmentDTO }): Promise<AssignmentResponseDTO> => {
  const response = await api.post<AssignmentResponseDTO>(`/ticket/${id}/forward`, payload);
  return response.data;
};

export const escalateTicket = async ({ id, payload }: { id: string; payload: ReassignmentDTO }): Promise<AssignmentResponseDTO> => {
  const response = await api.post<AssignmentResponseDTO>(`/ticket/${id}/escalate`, payload);
  return response.data;
};

// --- TanStack Query Hooks ---

export const useTicketsQuery = (query: TicketQueryDTO) => {
  return useQuery({
    queryKey: ['tickets', query],
    queryFn: () => fetchTickets(query),
    placeholderData: (previousData) => previousData,
  });
};

export const useTicketDetailQuery = (id: string) => {
  return useQuery({
    queryKey: ['ticket', id],
    queryFn: () => fetchTicketById(id),
    enabled: !!id,
  });
};

export const useTicketAssignmentsQuery = (ticketId: string) => {
  return useQuery({
    queryKey: ['ticket-assignments', ticketId],
    queryFn: () => fetchTicketAssignments(ticketId),
    enabled: !!ticketId,
  });
};

// --- Mutations ---

export const useCreateTicketMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TicketCreateDTO) => createTicket(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
};

export const useDeleteTicketMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTicket(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
};

export const useAcknowledgeTicketMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => acknowledgeTicket(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['ticket', id] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
};

export const useCompleteTicketMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => completeTicket(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['ticket', id] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
};

export const useForwardTicketMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ReassignmentDTO }) => forwardTicket({ id, payload }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['ticket', id] });
      queryClient.invalidateQueries({ queryKey: ['ticket-assignments', id] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
};

export const useEscalateTicketMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ReassignmentDTO }) => escalateTicket({ id, payload }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['ticket', id] });
      queryClient.invalidateQueries({ queryKey: ['ticket-assignments', id] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
};
