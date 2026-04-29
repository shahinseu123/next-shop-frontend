import { DataTable } from "@/components/admin/common/DataTable";
import { getBrands } from "@/app/actions/product";

// Define columns as plain data (no functions)
const columns = [
  { key: "id", label: "ID", type: "text" },
  { key: "logoUrl", label: "Logo", type: "image" },
  { key: "name", label: "Brand Name", type: "text" },
  { key: "slug", label: "Slug", type: "slug" },
  { key: "active", label: "Status", type: "status" },
];

export default async function BrandsPage() {
  const brands = await getBrands();

  return (
    <div className="bg-white border border-gray-200 rounded-lg pa-3 shodow">
      <DataTable
        title="Brands"
        description="Manage your product brands and their details"
        columns={columns}
        data={brands}
        searchPlaceholder="Search brands by name, slug..."
        searchFields={["name", "slug"]}
        addButtonText="Add Brand"
        basePath="/application/shop/admin/brands"
        showExport={true}
      />
    </div>
  );
}
