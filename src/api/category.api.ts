import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type {
  CategoryResponseDTO,
  CategoryCreateDTO,
  CategoryUpdateDTO,
  CategoryQueryDTO,
} from '@/types/category.type';
import type { PaginatedResponse } from '@/types/pagination.type';

export const fetchCategories = async (
  query: CategoryQueryDTO
): Promise<PaginatedResponse<CategoryResponseDTO>> => {
  const response = await api.get<PaginatedResponse<CategoryResponseDTO>>('/category/', {
    params: {
      page: query.page,
      limit: query.limit,
      search: query.search?.trim() || undefined,
    },
  });
  return response.data;
};

export const useCategoriesQuery = (query: CategoryQueryDTO) => {
  return useQuery({
    queryKey: ['categories', query],
    queryFn: () => fetchCategories(query),
    placeholderData: (previousData) => previousData,
  });
};

export const fetchCategoryById = async (id: string): Promise<CategoryResponseDTO> => {
  const response = await api.get<CategoryResponseDTO>(`/category/${id}`);
  return response.data;
};

export const useCategoryDetailQuery = (id: string) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => fetchCategoryById(id),
    enabled: !!id,
  });
};

export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CategoryCreateDTO) => {
      const response = await api.post<CategoryResponseDTO>('/category/', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: CategoryUpdateDTO }) => {
      const response = await api.patch<CategoryResponseDTO>(`/category/${id}`, payload);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['category', variables.id] });
    },
  });
};

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete<boolean>(`/category/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};
