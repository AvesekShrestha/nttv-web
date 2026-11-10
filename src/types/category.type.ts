export interface CategoryResponseDTO {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface CategoryCreateDTO {
  name: string;
  description: string;
}

export interface CategoryUpdateDTO {
  name?: string | null;
  description?: string | null;
}

export interface CategoryQueryDTO {
  page?: number;
  limit?: number;
  search?: string;
}

