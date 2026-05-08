export interface Brand {
    name: string,
    id: number,
    logoUrl: string,
    slug: null | string
}
export interface SliderType {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  mobileImageUrl: string;
  buttonText: string;
  isActive: boolean;
  createdAt: number[]; // [year, month, day, hour, minute, second, nanoseconds]
  updatedAt: number[]; // [year, month, day, hour, minute, second, nanoseconds]
}

export interface Category {
  id: number;
  name: string;
  parentId: number | null;
  slug: string;
  imageUrl: string;
  subCategories: Category[]
  createdAt: number[] | string; // Handle both array and string until backend is fixed
}
export interface ProductDetails {
  name: string
  id: number
  shortDescription: string
  longDescription: string
  brandId: number
  mrp: number
  discountPercentage: number
  quantityInStock: number
  discountPrice: number
  sellingPrice: number
  imageUrls: string[]
  categoryId: number
  isActive: number
  thumbnailUrl: string
  reviewCount: number
  averageRating: number
  stockStatus: string | null
  availabilityStatus: string | null
  isFeatured: number
  isNewArrival: number
  sku: string
  brandLogoUrl: string
  categoryName: string
  brandName: string
  categorySlug: string
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  sellingPrice: number;
  discountPrice?: number | null;
  discountPercentage?: number | null;
  imageUrls: string[] | null;
  thumbnailUrl: string;
  sku?: string | null;
  brandName: string;
  brandLogoUrl: string;
}

export interface PageResponse<T> {
  content: T[];
  number: number;
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  pageable?: {
    pageNumber: number;
    pageSize: number;
  };
  sort?: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  empty?: boolean;
}
