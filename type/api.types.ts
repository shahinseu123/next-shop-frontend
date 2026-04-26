// types/api.types.ts
export interface ApiOptions<T = any> {
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
}

export interface ApiError {
  message: string;
  status: number;
  data?: any;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface UseApiReturn<T = any> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  status: number | null;
  execute: (body?: any, customHeaders?: Record<string, string>) => Promise<ApiResponse<T>>;
  reset: () => void;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken?: string;
  token?: string;
  refreshToken?: string;
  user?: User;
  message?: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse {
  message: string;
  user?: User;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  role?: string;
}