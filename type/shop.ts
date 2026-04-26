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