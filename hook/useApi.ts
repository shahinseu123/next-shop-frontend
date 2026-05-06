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
  url?: string;  // Optional - only needed for dynamic URLs
  data?: any;
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://spring-shop-backend-production.up.railway.app';

export function useApi<T = any>(
  endpoint: string,  // Required - set your main URL here
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
        // Use URL from execute if provided, otherwise use the initial endpoint
        const targetUrl = executeOptions?.url || endpoint;

        // Use method from execute options if provided, otherwise use initial method
        const targetMethod = executeOptions?.method || method;

        // Extract data, params, and custom headers from options
        const bodyData = executeOptions?.data;
        const urlParams = executeOptions?.params;
        const customHeaders = executeOptions?.headers || {};

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...customHeaders,
        };

        // Determine if auth token should be added
        const shouldAddToken = options.requiresAuth !== false && !targetUrl.includes('/authenticate');
        
        if (shouldAddToken) {
          const token = localStorage.getItem('access_token');
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }
        }

        // Build URL with params
        const url = buildUrl(targetUrl, urlParams);
        
        const fetchOptions: RequestInit = {
          method: targetMethod,
          headers,
          ...(bodyData && targetMethod !== 'GET' && { body: JSON.stringify(bodyData) }),
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
          throw errorObj;
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
        throw errorObj;
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