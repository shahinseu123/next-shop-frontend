
import { getProduct } from "@/app/actions/product";
import ProductDetailsUI from "./ProductDetailsUI";
export default async function ProductDetailsContent({productId}: {productId: number}){
  const product  = await getProduct(productId)
  if(!product) {
    return <div>Product not found</div>
  }
  return (
    <>
     <ProductDetailsUI product={product} />
    </>
  )
}