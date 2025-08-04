export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  message: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  created_at: string;
  order_count?: number;
  total_spent?: number;
  last_order_date?: string;
}

export interface CustomerWithStats extends Customer {
  order_count: number;
  total_spent: number;
  last_order_date: string | null;
}

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface QueryParams {
  page?: string;
  limit?: string;
  search?: string;
  sort?: 'name' | 'email' | 'created_at' | 'order_count';
  order?: 'asc' | 'desc';
}