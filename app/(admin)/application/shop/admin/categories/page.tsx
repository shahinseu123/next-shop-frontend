"use client";
import {
  ApiContext,
  DataTable,
  DataTableHeader,
} from "@/components/admin/common/DataTable";
import { InboxIcon, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CategoriesPage() {
  const headers: DataTableHeader[] = [
    {
      key: "id",
      label: "ID",
      type: "text",
      sortable: true,
    },
    {
      key: "imageUrl",
      label: "Image",
      type: "image",
      render: (value: any, row: any) => {
        return <Image src={value} width={50} height={50} alt={row.name} />;
      },
    },
    {
      key: "name",
      label: "Category Name",
      type: "text",
      sortable: true,
    },

    {
      key: "slug",
      label: "Slug",
      type: "text",
    },
  ];

  const context: ApiContext = { url: "/api/v1/categories", method: "GET" };

  const editUser = (row: any) => {
    console.log(row);
  };
  const deleteUser = (id: number) => {
    console.log(id);
  };

  return (
    <div>
      <DataTable
        apiContext={context}
        headers={headers}
        slots={{
          Cell: ({ value, row, column, header }) => (
            <td className="px-6 py-4">
              {header.type === "image" ? (
                value ? (
                  <Image
                    src={value}
                    width={50}
                    height={50}
                    alt={row.name || "Image"}
                    unoptimized={true}
                    className="rounded-lg object-cover"
                  />
                ) : (
                    <div className="w-[50px] h-[50px] bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-xs text-gray-400">No img</span>
                    </div>
                )
              ) : header.type === "badge" ? (
                <span className="inline-flex px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-medium border border-gray-100">
                  {value}
                </span>
              ) : header.type === "date" ? (
                <span className="text-sm text-gray-600">
                  {value ? new Date(value).toLocaleDateString() : "-"}
                </span>
              ) : (
                <p className="text-sm text-gray-800">{value ?? "-"}</p>
              )}
            </td>
          ),
          Actions: ({ row }) => (
            <td>
              <div className="flex gap-2">
                <span
                  onClick={() => editUser(row)}
                  className="border border-gray-200 p-2 rounded cursor-pointer"
                >
                  <Pencil size={18} />
                </span>
                <span
                  onClick={() => deleteUser(row.id)}
                  className="border border-gray-200 p-2 rounded cursor-pointer"
                >
                  <Trash2 size={18} color="red" />
                </span>
              </div>
            </td>
          ),
          Empty: () => (
            <tr>
              <td colSpan={headers.length + 1} className="text-center py-8">
                <div className="flex flex-col items-center">
                  <InboxIcon className="w-12 h-12 text-gray-300" />
                  <p className="mt-2 text-gray-500">No data found</p>
                </div>
              </td>
            </tr>
          ),
        }}
        title="Categories"
        description="Manage your product categories and sub-categories"
      />
    </div>
  );
}
