import React from "react";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
}

export interface PaginationMetaData {
  page: number;
  limit: number;
  total: number;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  pagination: PaginationMetaData;
  onPageChange: (newPage: number) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  getRowId?: (item: T, index: number) => string | number;
}
