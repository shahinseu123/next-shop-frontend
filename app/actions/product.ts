'use server';

import { cookies } from 'next/headers';

// Types
type ProductFilters = {
  categoryId?: string;
  categoryName?: string;
  brandIds?: string[];
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  query?: string;
  page?: number;
  size?: number;
};

// Server Action: Fetch products with filters (handles all cases)
export async function getProducts(filters: ProductFilters = {}) {
  const token = (await cookies()).get('token')?.value;
  
  const searchParams = new URLSearchParams();
  
  if (filters.categoryId) searchParams.append('categoryId', filters.categoryId);
  if (filters.categoryName) searchParams.append('categoryName', filters.categoryName);
  
  // Handle multiple brandIds
  if (filters.brandIds && filters.brandIds.length > 0) {
    filters.brandIds.forEach(id => searchParams.append('brandId', id));
  }
  
  if (filters.minPrice) searchParams.append('minPrice', filters.minPrice.toString());
  if (filters.maxPrice) searchParams.append('maxPrice', filters.maxPrice.toString());
  if (filters.search) searchParams.append('search', filters.search);
  if (filters.query) searchParams.append('query', filters.query);
  if (filters.page !== undefined) searchParams.append('page', filters.page.toString());
  if (filters.size !== undefined) searchParams.append('size', filters.size.toString());
  
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
export async function getProduct(id: number) {
  const token = (await cookies()).get('accessToken')?.value;
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/products/details/${id}`, {
    // headers: {
    //   'Authorization': `Bearer ${token}`,
    // },
    next: {
      revalidate: false,
      // tags: [`product-${id}`],
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.statusText}`);
  }
  
  return response.json();
}

// Server Action: Get brands
export async function getBrands() {
  // const token = (await cookies()).get('accessToken')?.value;
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/brands/list`, {
    // headers: {
    //   'Authorization': `Bearer ${token}`,
    // },
    next: {
      // cache: 'no-store'
      // revalidate: false, // Brands don't change often - revalidate daily
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
  // const token = (await cookies()).get('accessToken')?.value;
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/categories/list`, {
    next: {
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.statusText}`);
  }
  
  return response.json();
}

// Server Action: Get sliders
export async function getSliders() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/sliders/list`, {
      next: {
        revalidate: 60 // Example: revalidate every minute
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch sliders: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching sliders:', error);
    throw error; // Or return a fallback
  }
}