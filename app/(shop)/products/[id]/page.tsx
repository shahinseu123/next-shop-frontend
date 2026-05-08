
import ProductDetailsContent from "@/components/product/ProductDetailsContent"
import ProductDeatilsSkeleton from "@/components/loader/ProductDetailsSkeleton"
import { Suspense } from "react"
interface ProductDetailsProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProductDetails({ params }: ProductDetailsProps) {
  const { id } = await params
  const productId = parseInt(id)
  
  
  return (
    <>
      <Suspense fallback={<ProductDeatilsSkeleton />}>
        <ProductDetailsContent productId={productId} />
      </Suspense>
    </>
  )
}