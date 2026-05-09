import { ProductDetails } from "@/type/shop";
import ProductDetailsSlider from "../slider/ProductDetailsSlider";
import ProductInfo from "./ProductInfo";
import ProductActions from "./ProductActions";
import ProductTabs from "./ProductTabs";
import RelatedProducts from "./RelatedProducts";
import SizeGuide from "./SizeGuide";

export default function ProductDetailsUI({
  product,
}: {
  product: ProductDetails;
}) {
  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-2 py-2">
      {/* Main Product Section - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-2 mb-2">
        {/* Left Column: Image Magnifier */}
        <div>
          <ProductDetailsSlider sliders={product.imageUrls} />
        </div>

        {/* Right Column: Product Info */}
        <ProductInfo product={product} />
      </div>

      {/* Product Actions: Quantity & Add to Cart */}
      <ProductActions
        product={product}
        // selectedSize={selectedSize}
        // selectedColor={selectedColor}
      />

      {/* Product Details Tabs */}
      <ProductTabs product={product} />

      {/* Size Guide Modal */}
      <SizeGuide />

      {/* Related Products Section */}
      {/* <RelatedProducts category={product.category} currentProductId={product.id} /> */}
    </div>
  );
}
