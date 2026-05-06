"use client"
import { useApi } from "@/hook/useApi";
import { useDeleteConfirmation } from "@/hook/useDeleteConfirmation";
import { ApiContext, DataTable, DataTableHeader } from "../common/DataTable";
import Image from "next/image";
import { DeleteConfirmationModal } from "../common/ConfirmationModal";
import { Empty } from "../common/Empty";
import { TableActions } from "../common/TableActions";
import { Cell } from "../common/Cell";
import { ButtonPrimary } from "@/components/utility/ButtonPrimary";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export const CategoryDataTable = () => {

    const router = useRouter()

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
    
      const {execute: executeDelete} = useApi("", "DELETE")
    
      const handleEdit = (row: any) => {
        console.log(row);
      };
       const deleteCategory = async (id: number) => {
        await executeDelete({url :`/api/v1/categories/delete/${id}`});
      };
    
      const handleCreate = () => {
         router.push("/application/shop/admin/categories/new")
      }
      const { deleteState, isLoading, openDeleteModal, closeDeleteModal, handleDelete } = useDeleteConfirmation();
    return (
         <div>
              <div className="header-container p-4 rounded-lg flex justify-between">
                <div className="title">Categories</div>
                <div className="title">
                    <ButtonPrimary title="Add" onClick={() => handleCreate()} icon={<Plus />} variant="solid" bgColor="blue" />
                </div>
              </div>
              <DataTable
                apiContext={context}
                headers={headers}
                slots={{
                  Cell: ({ value, row, column, header }) => (
                    <Cell column={column} header={header} row={row} value={value} />
                  ),
                  Actions: ({ row }) => (
                    <TableActions row={row} onEdit={handleEdit} onDelete={openDeleteModal} />
                    // <td>
                    //   <div className="flex gap-2">
                    //     <span
                    //       onClick={() => editUser(row)}
                    //       className="border border-gray-200 p-2 rounded cursor-pointer"
                    //     >
                    //       <Pencil size={18} />
                    //     </span>
                    //     <span
                    //       onClick={() => deleteUser(row.id)}
                    //       className="border border-gray-200 p-2 rounded cursor-pointer"
                    //     >
                    //       <Trash2 size={18} color="red" />
                    //     </span>
                    //   </div>
                    // </td>
                  ),
                  Empty: () => (
                    <Empty colspan={headers.length + 1} />
                  )
                }}
                title="Categories"
                description="Manage your product categories and sub-categories"
              />
              <DeleteConfirmationModal
                isOpen={deleteState.isOpen}
                onClose={closeDeleteModal}
                onConfirm={() => handleDelete(deleteCategory)}
                itemName={deleteState.name}
                isLoading={isLoading}
              />
            </div>
    )
}