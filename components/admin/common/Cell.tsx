import Image from "next/image"

interface CellProps {
    value: any
    row: any
    column: any
    header: {
        type?: "image" | "badge" | "date" | "text" | "custom"  // Added "custom"
        [key: string]: any
    }
}

const ImageCell = ({ value, alt }: { value: string; alt: string }) => (
    <Image
        src={value}
        width={50}
        height={50}
        alt={alt}
        unoptimized={true}
        className="rounded-lg object-cover"
    />
)

const EmptyImageCell = () => (
    <div className="w-[50px] h-[50px] bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-xs text-gray-400">No img</span>
    </div>
)

const BadgeCell = ({ value }: { value: string }) => (
    <span className="inline-flex px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-medium border border-gray-100">
        {value}
    </span>
)

const DateCell = ({ value }: { value: string | number | Date }) => (
    <span className="text-sm text-gray-600">
        {value ? new Date(value).toLocaleDateString() : "-"}
    </span>
)

const TextCell = ({ value }: { value: any }) => (
    <p className="text-sm text-gray-800">{value ?? "-"}</p>
)

const cellRenderers = {
    image: (value: any, row: any) => 
        value ? <ImageCell value={value} alt={row.name || "Image"} /> : <EmptyImageCell />,
    badge: (value: any) => <BadgeCell value={value} />,
    date: (value: any) => <DateCell value={value} />,
    text: (value: any) => <TextCell value={value} />,
}

export const Cell = ({ value, row, column, header }: CellProps) => {
    const cellType = header?.type || "text"
    const renderCell = cellRenderers[cellType] || cellRenderers.text

    return (
        <td className="px-6 py-4">
            {renderCell(value, row)}
        </td>
    )
}