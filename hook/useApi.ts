// hooks/useApi.ts
import { useState, useCallback } from 'react';

interface ApiOptions<T = any> {
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
  requiresAuth?: boolean;
}

interface ApiError {
  message: string;
  status: number;
  data?: any;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

interface ExecuteOptions {
  data?: any;
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://spring-shop-backend-production.up.railway.app';

export function useApi<T = any>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
  options: ApiOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [status, setStatus] = useState<number | null>(null);

  // Helper function to build URL with params
  const buildUrl = useCallback((baseEndpoint: string, params?: Record<string, string | number | boolean>) => {
    if (!params) return `${API_BASE_URL}${baseEndpoint}`;
    
    const url = new URL(`${API_BASE_URL}${baseEndpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
    return url.toString();
  }, []);

  const execute = useCallback(
    async (executeOptions?: ExecuteOptions) => {
      setLoading(true);
      setError(null);

      try {
        // Extract data, params, and custom headers from options
        const bodyData = executeOptions?.data;
        const urlParams = executeOptions?.params;
        const customHeaders = executeOptions?.headers || {};

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...customHeaders,
        };

        // Only add auth token if:
        // 1. requiresAuth is true (default to true for non-login endpoints)
        // 2. AND it's not the login endpoint
        const shouldAddToken = options.requiresAuth !== false && !endpoint.includes('/authenticate');
        
        if (shouldAddToken) {
          const token = localStorage.getItem('access_token');
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }
        }

        // Build URL with params
        const url = buildUrl(endpoint, urlParams);
        
        const fetchOptions: RequestInit = {
          method,
          headers,
          ...(bodyData && { body: JSON.stringify(bodyData) }),
        };

        const response = await fetch(url, fetchOptions);
        let responseData: any;
        
        try {
          responseData = await response.json();
        } catch {
          responseData = null;
        }

        setStatus(response.status);

        if (!response.ok) {
          const errorObj: ApiError = {
            status: response.status,
            message: responseData?.message || responseData?.error || `Request failed with status ${response.status}`,
            data: responseData,
          };
          setError(errorObj);
          if (options.onError) {
            options.onError(errorObj);
          }
          throw errorObj; // Throw to allow try/catch in component
        }

        setData(responseData);
        if (options.onSuccess) {
          options.onSuccess(responseData);
        }
        return { success: true, data: responseData };

      } catch (err: any) {
        const errorObj: ApiError = {
          status: err.status || 500,
          message: err.message || 'Network error occurred',
          data: err.data || err,
        };
        setError(errorObj);
        if (options.onError) {
          options.onError(errorObj);
        }
        throw errorObj; // Re-throw for component-level handling
      } finally {
        setLoading(false);
      }
    },
    [endpoint, method, options, buildUrl]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
    setStatus(null);
  }, []);

  return {
    data,
    loading,
    error,
    status,
    execute,
    reset,
  };
}