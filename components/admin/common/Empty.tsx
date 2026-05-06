import { InboxIcon } from "lucide-react"

export const Empty = ({colspan}: {colspan: number}) => {
    return (
        <tr>
              <td colSpan={colspan} className="text-center py-8">
                <div className="flex flex-col items-center">
                  <InboxIcon className="w-12 h-12 text-gray-300" />
                  <p className="mt-2 text-gray-500">No data found</p>
                </div>
              </td>
            </tr>
    )
}