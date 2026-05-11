"use client";
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
import { Plus } from "lucide-react";

export const CouponDataTable = () => {
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);

  const headers: DataTableHeader[] = [
  
    {
      key: "code",
      label: "Coupon Code",
      type: "text",
      sortable: true,
    },
    {
      key: "discountType",
      label: "Discount Type",
      type: "text",
      sortable: true,
      render: (value: any) => {
        return value === 1 ? "Percentage" : "Fixed Amount";
      },
    },
    {
      key: "discountValue",
      label: "Discount Value",
      type: "number",
      sortable: true,
      render: (value: any, row: any) => {
        return row.discountType === 1 ? `${value}%` : `$${value}`;
      },
    },
    {
      key: "minimumOrderAmount",
      label: "Min. Order Amount",
      type: "number",
      sortable: true,
      render: (value: any) => {
        return `$${value}`;
      },
    },
    {
      key: "maximumDiscountAmount",
      label: "Max. Discount Amount",
      type: "number",
      render: (value: any) => {
        return value ? `$${value}` : "Unlimited";
      },
    },
  {
  key: "status",
  label: "Status",
  type: "badge",
  sortable: true,
  render: (value: any) => {
    const isActive = value === 1;
    return (
      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        isActive 
          ? "bg-green-50 text-green-700 border-green-200" 
          : "bg-red-50 text-red-700 border-red-200"
      }`}>
        {isActive ? "Active" : "Inactive"}
      </span>
    );
  },
},
  ];

  const context: ApiContext = { url: "/api/v1/coupons", method: "GET" };

  const { execute: executeDelete } = useApi("", "DELETE");

  const handleEdit = (row: any) => {
    console.log(row);
  };
  const deleteCoupon = async (id: number) => {
    await executeDelete({ url: `/api/v1/coupons/delete/${id}` });
    setRefreshKey((prev) => prev + 1);
  };

  const handleCreate = () => {
    router.push("/application/shop/admin/coupons/new");
  };
  const {
    deleteState,
    isLoading,
    openDeleteModal,
    closeDeleteModal,
    handleDelete,
  } = useDeleteConfirmation();
  return (
    <div>
      <div className="header-container p-4 rounded-lg flex justify-between">
        <div className="title">Coupons</div>
        <div className="title">
          <ButtonPrimary
            title="Add"
            onClick={() => handleCreate()}
            icon={<Plus size={20} />}
            variant="solid"
            bgColor="blue"
          />
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
            <TableActions
              row={row}
              onEdit={handleEdit}
              onDelete={openDeleteModal}
            />
          ),
          Empty: () => <Empty colspan={headers.length + 1} />,
        }}
        title="Coupons"
        description="Manage your coupons"
      />
      <DeleteConfirmationModal
        isOpen={deleteState.isOpen}
        onClose={closeDeleteModal}
        onConfirm={() => handleDelete(deleteCoupon)}
        itemName={deleteState.name}
        isLoading={isLoading}
      />
    </div>
  );
};
