import { ProductDataTable } from "@/components/admin/product/ProductDataTable";
export default async function ProductPage() {

  return (
    <div className="bg-white border border-gray-200 rounded-lg pa-3 shodow">
      <ProductDataTable />
    </div>
  );
}
