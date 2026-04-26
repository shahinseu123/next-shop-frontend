'use client';

import useSWR from 'swr';
import { apiFetch } from '@/lib/api'; // Your existing client fetch

export function useProducts(filters?: any) {
  const queryString = filters ? '?' + new URLSearchParams(filters) : '';
  
  const { data, error, isLoading, mutate } = useSWR(
    `/products${queryString}`,
    (url) => apiFetch(url),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      keepPreviousData: true,
    }
  );
  
  return {
    products: data?.products || [],
    total: data?.total || 0,
    isLoading,
    error,
    mutate,
  };
}

export function useBrands() {
  return useSWR('/brands', (url) => apiFetch(url));
}

export function useCategories() {
  return useSWR('/categories', (url) => apiFetch(url));
}