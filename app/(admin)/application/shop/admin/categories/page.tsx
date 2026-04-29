"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/admin/common/DataTable";
import { useApi } from "@/hook/useApi";
interface Category {
  id: number;
  name: string;
  parentId: number | null;
  slug: string;
  imageUrl: string;
  createdAt: string;
}

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryMap, setCategoryMap] = useState<Map<number, Category>>(new Map());

  // Fetch categories
  const { 
    execute: fetchCategories, 
    loading, 
    error 
  } = useApi('/api/v1/categories', 'GET', {
    onSuccess: (data) => {
      setCategories(data);
      // Build category map for parent name lookup
      const map = new Map();
      data.forEach((cat: Category) => {
        map.set(cat.id, cat);
      });
      setCategoryMap(map);
    }
  });

  // Delete category
  const { execute: deleteCategory } = useApi('/api/v1/categories', 'DELETE', {
    onSuccess: () => {
      fetchCategories(); // Refresh the list
    }
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (category: Category) => {
    if (confirm(`Are you sure you want to delete "${category.name}"? This action cannot be undone.`)) {
      await deleteCategory({ 
        data: { id: category.id }
      });
    }
  };

  const handleEdit = (category: Category) => {
    router.push(`/application/shop/admin/categories/${category.id}/edit`);
  };

  const getParentName = (parentId: number | null): string => {
    if (!parentId) return "—";
    const parent = categoryMap.get(parentId);
    return parent?.name || "Unknown";
  };

  // Define columns matching the brand page structure
  const columns = [
    { key: "id", label: "ID", type: "text", sortable: true },
    { key: "imageUrl", label: "Image", type: "image" },
    { key: "name", label: "Category Name", type: "text", sortable: true },
    { 
      key: "parentId", 
      label: "Parent Category", 
      type: "text",
      render: (value: number, row: Category) => getParentName(value)
    },
    { key: "slug", label: "Slug", type: "slug" },
    { key: "createdAt", label: "Created Date", type: "date" },
  ];

  return (
    <DataTable
      title="Categories"
      description="Manage your product categories and sub-categories"
      columns={columns}
      data={categories}
      loading={loading}
      searchPlaceholder="Search categories by name or slug..."
      searchFields={["name", "slug"]}
      addButtonText="Add Category"
      onAdd={() => router.push("/application/shop/admin/categories/new")}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onRefresh={fetchCategories}
    />
  );
}