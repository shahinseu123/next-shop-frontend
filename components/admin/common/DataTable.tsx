"use client";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import { TableSkeleton } from "./TableSkeleton";
import { useApi } from "@/hook/useApi";
import {
  Filter,
  Plus,
  Pencil,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  AlertCircle,
  InboxIcon,
} from "lucide-react";

export interface DataTableHeader {
  key: string;
  label: string;
  type?: "text" | "image" | "badge" | "date" | "custom";
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface ApiContext {
  url: string;
  method: "POST" | "GET" | "DELETE" | "PUT";
}

// Slot Component Types
interface ToolbarSlotProps {
  search: string;
  onSearch: (value: string) => void;
  onAdd?: () => void;
}

interface HeaderSlotProps {
  headers: DataTableHeader[];
}

interface CellSlotProps {
  value: any;
  row: any;
  column: string;
  header: DataTableHeader;
}

interface ActionsSlotProps {
  row: any;
  onEdit?: (row: any) => void;
  onDelete?: (id: number) => void;
}

interface PaginationSlotProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

interface DataTableSlots {
  Toolbar?: React.ComponentType<ToolbarSlotProps>;
  Header?: React.ComponentType<HeaderSlotProps>;
  Cell?: React.ComponentType<CellSlotProps>;
  Actions?: React.ComponentType<ActionsSlotProps>;
  Empty?: React.ComponentType;
  Loading?: React.ComponentType;
  Pagination?: React.ComponentType<PaginationSlotProps>;
}

interface DataTableProps {
  title: string;
  description?: string;
  headers: DataTableHeader[];
  apiContext: ApiContext;
  slots?: DataTableSlots;
  onAdd?: () => void;
  onEdit?: (row: any) => void;
  onDelete?: (id: number) => void;
  defaultPageSize?: number;
  refreshKey?: number;
}

// Default slot components
const DefaultToolbar = ({ search, onSearch, onAdd }: ToolbarSlotProps) => (
  <div className="flex items-center justify-between mb-6 gap-3">
    <div className="relative flex-1 max-w-xs">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200"
      />
    </div>

    <div className="flex items-center gap-2">
      <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 hover:bg-gray-50">
        <Filter size={16} />
        Filter
      </button>
      {onAdd && (
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700"
        >
          <Plus size={16} />
          Add New
        </button>
      )}
    </div>
  </div>
);

const DefaultHeader = ({ headers }: HeaderSlotProps) => (
  <thead>
    <tr className="bg-gray-50/50 border-b border-gray-100">
      {headers.map((header) => (
        <th
          key={header.key}
          className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
        >
          {header.label}
        </th>
      ))}
      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Actions
      </th>
    </tr>
  </thead>
);

const DefaultCell = ({ value, column, header, row }: CellSlotProps) => {
  // If a custom render function is provided, use it
  if (header.render) {
    return <td className="px-6 py-4">{header.render(value, row)}</td>;
  }

  // Handle different types when no render function is provided
  switch (header.type) {
    case "image":
      return (
        <td className="px-6 py-4">
          {value ? (
            <div className="relative w-10 h-10">
              <Image
                src={value}
                alt={row?.name || column || "Image"}
                fill
                className="rounded-lg object-cover"
                sizes="40px"
              />
            </div>
          ) : (
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <InboxIcon size={16} className="text-gray-400" />
            </div>
          )}
        </td>
      );

    case "badge":
      return (
        <td className="px-6 py-4">
          <span className="inline-flex px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-medium border border-gray-100">
            {value ?? "-"}
          </span>
        </td>
      );

    case "date":
      return (
        <td className="px-6 py-4">
          <p className="text-sm text-gray-800">
            {value
              ? new Date(value).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "-"}
          </p>
        </td>
      );

    case "text":
    default:
      return (
        <td className="px-6 py-4">
          <p className="text-sm text-gray-800">{value ?? "-"}</p>
        </td>
      );
  }
};

const DefaultActions = ({ row, onEdit, onDelete }: ActionsSlotProps) => (
  <td className="px-6 py-4">
    <div className="flex justify-end gap-2">
      {onEdit && (
        <button
          onClick={() => onEdit(row)}
          className="border border-gray-200 p-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          title="Edit"
        >
          <Pencil size={18} />
        </button>
      )}
      {onDelete && (
        <button
          onClick={() => onDelete(row.id)}
          className="border border-gray-200 p-2 rounded-lg cursor-pointer hover:bg-red-50 transition-colors"
          title="Delete"
        >
          <Trash2 size={18} color="red" />
        </button>
      )}
    </div>
  </td>
);

const DefaultEmpty = () => (
  <tr>
    <td colSpan={100} className="text-center py-16">
      <div className="flex flex-col items-center">
        <InboxIcon className="w-16 h-16 text-gray-300" />
        <p className="mt-4 text-gray-500 font-medium">No data found</p>
        <p className="mt-1 text-sm text-gray-400">
          Try adjusting your search or filters
        </p>
      </div>
    </td>
  </tr>
);

const DefaultLoading = () => (
  <tr>
    <td colSpan={100} className="text-center py-16">
      <div className="flex flex-col items-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="mt-4 text-gray-500">Loading data...</p>
      </div>
    </td>
  </tr>
);

const DefaultPagination = ({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}: PaginationSlotProps) => {
  const startItem = currentPage * 10 + 1;
  const endItem = Math.min((currentPage + 1) * 10, totalItems);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 2) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between mt-6">
      <p className="text-sm text-gray-400">
        Showing{" "}
        <span className="font-medium text-gray-600">{startItem}</span> to{" "}
        <span className="font-medium text-gray-600">{endItem}</span> of{" "}
        <span className="font-medium text-gray-600">{totalItems}</span> results
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(0)}
          disabled={currentPage === 0}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-800 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronsLeft size={16} />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-800 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
        </button>

        {getPageNumbers().map((page, index) => (
          <div key={index}>
            {typeof page === "string" ? (
              <span className="px-1 text-gray-300">...</span>
            ) : (
              <button
                onClick={() => onPageChange(page - 1)}
                className={`w-8 h-8 rounded-lg text-sm font-medium ${
                  currentPage === page - 1
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            )}
          </div>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-800 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight size={16} />
        </button>
        <button
          onClick={() => onPageChange(totalPages - 1)}
          disabled={currentPage >= totalPages - 1}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-800 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
};

export function DataTable({
  apiContext,
  headers,
  slots = {},
  title,
  description,
  onAdd,
  onEdit,
  onDelete,
  defaultPageSize = 10,
  refreshKey = 0
}: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [size, setSize] = useState(defaultPageSize);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<any[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const isInitialMount = useRef(true);

  // Extract slot components with defaults
  const {
    Toolbar = DefaultToolbar,
    Header = DefaultHeader,
    Cell = DefaultCell,
    Actions = DefaultActions,
    Empty = DefaultEmpty,
    Loading = DefaultLoading,
    Pagination = DefaultPagination,
  } = slots;

  const { execute: fetchData, loading } = useApi(
    apiContext.url,
    apiContext.method,
    {
      onSuccess(data: any) {
        setRows(data.content || data.data || []);
        setTotalItems(data.totalElements || data.total || 0);
        setTotalPages(
          data.totalPages ||
            Math.ceil((data.totalElements || data.total || 0) / size)
        );
        setError(null);
      },
      onError(error) {
        console.error("Failed to fetch data:", error);
        setError(error.message || "Failed to load data");
      },
    }
  );

  const searchFields = useMemo<string[]>(() => {
    if (!headers || !headers.length) return [];
    return headers
      .filter((header) => header.type === "text" || header.type === undefined)
      .map((header) => header.key);
  }, [headers]);

  const getParams = useCallback(() => {
    const params: Record<string, string | number | boolean> = {
      page: currentPage,
      size: size,
    };
    if (search && searchFields.length > 0) {
      params.search = search;
    }
    return params;
  }, [currentPage, size, search, searchFields]);

  const fetchPaginatedList = useCallback(async () => {
    const params = getParams();
    await fetchData({ params });
  }, [fetchData, getParams]);

  // Initial fetch
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      fetchPaginatedList();
    }
  }, []);

  // Fetch when page or size changes
  useEffect(() => {
    if (!isInitialMount.current) {
      fetchPaginatedList();
    }
  }, [currentPage, size, refreshKey]);

  // Debounced search
  useEffect(() => {
    if (isInitialMount.current) return;

    const timeoutId = setTimeout(() => {
      setCurrentPage(0);
      fetchPaginatedList();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search]);

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(0, Math.min(page, totalPages - 1)));
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="mx-auto">
       

        {/* Toolbar Slot */}
        <Toolbar search={search} onSearch={handleSearch} onAdd={onAdd} />

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={fetchPaginatedList}
              className="ml-auto text-sm text-red-600 hover:text-red-800 underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Table */}
        <div className="border border-gray-100 rounded-2xl overflow-hidden">
          <table className="w-full">
            {/* Header Slot */}
            <Header headers={headers} />

            {/* Body */}
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <TableSkeleton />
              ) : rows.length === 0 ? (
                <Empty />
              ) : (
                rows.map((row, index) => (
                  <tr
                    key={row.id || index}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Cell Slots */}
                    {headers.map((header) => (
                      <Cell
                        key={header.key}
                        value={row[header.key]}
                        row={row}
                        column={header.key}
                        header={header}
                      />
                    ))}

                    {/* Actions Slot */}
                    <Actions row={row} onEdit={onEdit} onDelete={onDelete} />
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Slot */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}