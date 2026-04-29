"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Plus,
  Filter,
  Download,
  ChevronDown
} from "lucide-react";

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  type?: 'text' | 'image' | 'status' | 'slug' | 'price' | 'date' | 'badge';
}

export interface DataTableProps {
  title: string;
  description?: string;
  columns: Column[];
  data: any[];
  searchPlaceholder?: string;
  searchFields?: string[];
  addButtonText?: string;
  addButtonLink?: string;
  onAdd?: () => void;
  itemsPerPage?: number;
  basePath?: string;
  onDelete?: (id: number) => Promise<void>;
  showExport?: boolean;
}

export function DataTable({
  title,
  description,
  columns,
  data: initialData,
  searchPlaceholder = "Search...",
  searchFields = [],
  addButtonText = "Add New",
  addButtonLink,
  onAdd,
  itemsPerPage = 10,
  basePath,
  onDelete: customDelete,
  showExport = false,
}: DataTableProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState(initialData);
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleAdd = () => {
    if (onAdd) {
      onAdd();
    } else if (addButtonLink) {
      router.push(addButtonLink);
    } else if (basePath) {
      router.push(`${basePath}/new`);
    }
  };

  const handleExport = () => {
    // Convert data to CSV
    const headers = columns.map(col => col.label).join(",");
    const rows = data.map(row => 
      columns.map(col => {
        let value = row[col.key];
        if (col.type === 'price') value = `$${value}`;
        if (col.type === 'date') value = new Date(value).toLocaleDateString();
        return `"${String(value).replace(/"/g, '""')}"`;
      }).join(",")
    );
    
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, "-")}-export.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSort = (key: string) => {
    if (sortField === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(key);
      setSortDirection("asc");
    }
  };

  // Sort data
  const sortedData = [...data].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Filter data based on search
  const filteredData = sortedData.filter((row) => {
    if (!searchTerm) return true;
    const fieldsToSearch = searchFields.length > 0 ? searchFields : Object.keys(row);
    return fieldsToSearch.some((field) =>
      String(row[field]).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEdit = (row: any) => {
    if (basePath) {
      router.push(`${basePath}/${row.id}/edit`);
    }
  };

  const handleDelete = async (row: any) => {
    if (!confirm(`Are you sure you want to delete ${row.name || row.title}? This action cannot be undone.`)) {
      return;
    }

    if (customDelete) {
      await customDelete(row.id);
      setData(data.filter((item: any) => item.id !== row.id));
    } else if (basePath) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${basePath}/${row.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        if (response.ok) {
          setData(data.filter((item: any) => item.id !== row.id));
        } else {
          alert("Failed to delete item");
        }
      } catch (error) {
        console.error("Failed to delete:", error);
        alert("An error occurred while deleting");
      }
    }
  };

  const handleStatusToggle = async (row: any) => {
    const newStatus = row.active === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${basePath}/${row.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({ ...row, active: newStatus }),
      });

      if (response.ok) {
        setData(data.map((item: any) => 
          item.id === row.id ? { ...item, active: newStatus } : item
        ));
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  // Cell renderer based on column type
  const renderCell = (column: Column, value: any, row: any) => {
    switch (column.type) {
      case 'image':
        return (
          <div className="relative w-10 h-10">
            {value ? (
              <Image
                src={value}
                alt={row.name || row.title || 'Image'}
                fill
                className="object-cover rounded-lg"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-gray-400">
                  {(row.name || row.title || '?').charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        );
      
      case 'status':
        const isActive = value === "ACTIVE" || value === true;
        return (
          <button
            onClick={() => handleStatusToggle(row)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
              isActive
                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
            {value}
          </button>
        );
      
      case 'slug':
        return (
          <code className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
            /{value}
          </code>
        );
      
      case 'price':
        return (
          <span className="font-semibold text-gray-900">
            ${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        );
      
      case 'date':
        return (
          <span className="text-gray-500 text-sm">
            {new Date(value).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}
          </span>
        );
      
      case 'badge':
        const badgeColors: Record<string, string> = {
          'HIGH': 'bg-red-100 text-red-700',
          'MEDIUM': 'bg-yellow-100 text-yellow-700',
          'LOW': 'bg-green-100 text-green-700',
        };
        return (
          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${badgeColors[value] || 'bg-gray-100 text-gray-700'}`}>
            {value}
          </span>
        );
      
      default:
        if (typeof value === 'string' && value.length > 50) {
          return <span title={value}>{value.substring(0, 50)}...</span>;
        }
        return value;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {description && <p className="text-gray-500 mt-1 text-sm">{description}</p>}
          </div>
          
          <div className="flex items-center gap-3">
            {showExport && data.length > 0 && (
              <button
                onClick={handleExport}
                className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2 text-gray-700 font-medium"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            )}
            <button
              onClick={handleAdd}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all flex items-center gap-2 font-medium shadow-sm hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
              {addButtonText}
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
            />
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              className="px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2 text-gray-600"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      {filteredData.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No data found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? "No results match your search criteria" : `No ${title.toLowerCase()} available yet`}
            </p>
            {searchTerm ? (
              <button
                onClick={() => handleSearch("")}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear search
              </button>
            ) : (
              <button
                onClick={handleAdd}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <Plus className="w-4 h-4" />
                Add your first {title.slice(0, -1).toLowerCase()}
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    {columns.map((column) => (
                      <th
                        key={column.key}
                        onClick={() => column.sortable && handleSort(column.key)}
                        className={`px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${
                          column.sortable ? 'cursor-pointer hover:text-gray-900 select-none' : ''
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          {column.label}
                          {column.sortable && sortField === column.key && (
                            <ChevronDown className={`w-3 h-3 transition-transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                          )}
                        </div>
                      </th>
                    ))}
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentData.map((row, index) => (
                    <tr key={row.id || index} className="hover:bg-gray-50 transition-colors group">
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className="px-6 py-4 whitespace-nowrap text-sm"
                        >
                          {renderCell(column, row[column.key], row)}
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEdit(row)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors opacity-60 group-hover:opacity-100"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(row)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-60 group-hover:opacity-100"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-gray-500">
                  Showing <span className="font-medium text-gray-700">{indexOfFirstItem + 1}</span> to{" "}
                  <span className="font-medium text-gray-700">{Math.min(indexOfLastItem, filteredData.length)}</span> of{" "}
                  <span className="font-medium text-gray-700">{filteredData.length}</span> results
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 text-sm font-medium"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 rounded-xl transition-all font-medium ${
                            currentPage === pageNum
                              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm"
                              : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 text-sm font-medium"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}