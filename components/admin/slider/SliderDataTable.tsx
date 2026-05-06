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
import { useState } from "react";
import { Plus } from 'lucide-react'

export const SliderDataTable = () => {

    const router = useRouter()
    const [refreshKey, setRefreshKey] = useState(0);

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
          key: "title",
          label: "SliderTitle",
          type: "text",
          sortable: true,
        },
    
        {
          key: "status",
          label: "Status",
          type: "badge",
        },
      ];
    
      const context: ApiContext = { url: "/api/v1/sliders", method: "GET" };
    
      const {execute: executeDelete} = useApi("", "DELETE")
    
      const handleEdit = (row: any) => {
        console.log(row);
      };
       const deleteSlider = async (id: number) => {
        await executeDelete({url :`/api/v1/sliders/delete/${id}`});
        setRefreshKey(prev => prev + 1);
      };
    
      const handleCreate = () => {
         router.push("/application/shop/admin/slider/new")
      }
      const { deleteState, isLoading, openDeleteModal, closeDeleteModal, handleDelete } = useDeleteConfirmation();
    return (
         <div>
              <div className="header-container p-4 rounded-lg flex justify-between">
                <div className="title">Slider</div>
                <div className="title">
                    <ButtonPrimary title="Add" onClick={() => handleCreate()} icon={<Plus size={20} />} variant="solid" bgColor="blue" />
                </div>
              </div>
              <DataTable
                apiContext={context}
                headers={headers}
                refreshKey={refreshKey}
                slots={{
                  Cell: ({ value, row, column, header }) => (
                    <Cell column={column} header={header} row={row} value={value} />
                  ),
                  Actions: ({ row }) => (
                    <TableActions row={row} onEdit={handleEdit} onDelete={openDeleteModal} />
                  
                  ),
                  Empty: () => (
                    <Empty colspan={headers.length + 1} />
                  )
                }}
                title="Slider"
                description="Manage your slider"
              />
              <DeleteConfirmationModal
                isOpen={deleteState.isOpen}
                onClose={closeDeleteModal}
                onConfirm={() => handleDelete(deleteSlider)}
                itemName={deleteState.name}
                isLoading={isLoading}
              />
            </div>
    )
}