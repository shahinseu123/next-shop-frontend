import { Pencil, Trash2 } from "lucide-react"
interface TableActionProps<T extends { id: number }> {
    row: T
    onEdit: (row: T) => void
    onDelete: (id: number) => void
}

export const TableActions = <T extends { id: number }>({row, onEdit, onDelete}: TableActionProps<T>) => {
    return (
        <td>
              <div className="flex gap-2">
                <span
                  onClick={() => onEdit(row)}
                  className="border border-gray-200 p-2 rounded cursor-pointer"
                >
                  <Pencil size={18} />
                </span>
                <span
                  onClick={() => onDelete(row.id)}
                  className="border border-gray-200 p-2 rounded cursor-pointer"
                >
                  <Trash2 size={18} color="red" />
                </span>
              </div>
            </td>
    )
}