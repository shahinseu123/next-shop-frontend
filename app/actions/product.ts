'use server';

import { cookies } from 'next/headers';

// Types
type ProductFilters = {
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
};

// Server Action: Fetch products with filters
export async function getProducts(filters: ProductFilters = {}) {
  const token = (await cookies()).get('token')?.value;
  
  const searchParams = new URLSearchParams();
  if (filters.categoryId) searchParams.append('categoryId', filters.categoryId);
  if (filters.brandId) searchParams.append('brandId', filters.brandId);
  if (filters.minPrice) searchParams.append('minPrice', filters.minPrice.toString());
  if (filters.maxPrice) searchParams.append('maxPrice', filters.maxPrice.toString());
  if (filters.search) searchParams.append('search', filters.search);
  if (filters.page) searchParams.append('page', filters.page.toString());
  if (filters.limit) searchParams.append('limit', filters.limit.toString());
  
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/products?${searchParams.toString()}`,
    {
      headers: {
        // 'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 3600, // ISR: revalidate every hour
        tags: ['products'], // For on-demand revalidation
      },
    }
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }
  
  return response.json();
}

// Server Action: Get single product
export async function getProduct(id: string) {
  const token = (await cookies()).get('accessToken')?.value;
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/products/${id}`, {
    // headers: {
    //   'Authorization': `Bearer ${token}`,
    // },
    next: {
      revalidate: 3600,
      tags: [`product-${id}`],
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.statusText}`);
  }
  
  return response.json();
}

// Server Action: Get brands
export async function getBrands() {
  const token = (await cookies()).get('accessToken')?.value;
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/brands/list`, {
    // headers: {
    //   'Authorization': `Bearer ${token}`,
    // },
    next: {
      revalidate: false, // Brands don't change often - revalidate daily
      // tags: ['brands'],
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch brands: ${response.statusText}`);
  }
  
  return response.json();
}

// Server Action: Get categories
export async function getCategories() {
  const token = (await cookies()).get('accessToken')?.value;
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/categories`, {
    // headers: {
    //   'Authorization': `Bearer ${token}`,
    // },
    next: {
      // revalidate: 86400,
      // tags: ['categories'],
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.statusText}`);
  }
  
  return response.json();
}

// Server Action: Get products by category
export async function getProductsByCategory(categoryId: string, limit = 10) {
  return getProducts({ categoryId, limit });
}

// Server Action: Get products by brand
export async function getProductsByBrand(brandId: string, limit = 10) {
  return getProducts({ brandId, limit });
}