"use client";

interface TableRowSkeletonProps {
  columns: number;
  hasActions?: boolean;
}

export const TableRowSkeleton = ({ columns, hasActions = true }: TableRowSkeletonProps) => {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: columns }).map((_, colIndex) => (
        <td key={colIndex} className="px-6 py-4">
          <div className="h-4 bg-gray-200 rounded w-full max-w-[120px]" />
        </td>
      ))}
      {hasActions && (
        <td className="px-6 py-4">
          <div className="flex justify-end gap-2">
            <span className="inline-block w-9 h-9 bg-gray-100 rounded-lg" />
            <span className="inline-block w-9 h-9 bg-gray-100 rounded-lg" />
          </div>
        </td>
      )}
    </tr>
  );
};

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export const TableSkeleton = ({ rows = 5, columns = 4 }: TableSkeletonProps) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRowSkeleton key={index} columns={columns} />
      ))}
    </>
  );
};