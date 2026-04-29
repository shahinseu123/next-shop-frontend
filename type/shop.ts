export interface Brand {
    name: string,
    id: number,
    logoUrl: string,
    slug: null | string
}
export interface Category {
    name: string,
    id: number,
    slug: string,
    imageUrl: string,
    createdAt: string
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