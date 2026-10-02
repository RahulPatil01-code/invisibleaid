import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import EmptyState from './EmptyState';

export default function DataTable({ 
  columns, 
  data, 
  onRowClick, 
  actions, 
  searchable, 
  searchPlaceholder = 'Search...', 
  pagination, 
  pageSize = 10, 
  emptyMessage = 'No data available',
  loading = false
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleSort = (key, isSortable) => {
    if (!isSortable) return;
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      key = null;
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const getColKey = (col) => col.key ?? col.accessor ?? '';
  const getColLabel = (col) => col.label ?? col.header ?? '';
  const getColRender = (col) => col.render ?? col.cell;

  const filteredData = useMemo(() => {
    if (!searchable || !searchTerm) return data;
    return data.filter(row => 
      columns.some(col => {
        const k = getColKey(col);
        const val = row[k];
        return val != null && String(val).toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchable, searchTerm, columns]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, pagination, currentPage, pageSize]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {searchable && (
        <div className="p-4 border-b border-gray-200">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {columns.map((col, i) => {
                const k = getColKey(col);
                const label = getColLabel(col);
                return (
                  <th 
                    key={i} 
                    className={`px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider ${col.sortable !== false ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                    onClick={() => handleSort(k, col.sortable !== false)}
                  >
                    <div className="flex items-center gap-1">
                      {label}
                      {col.sortable !== false && (
                        <span className="flex flex-col">
                          <ChevronUp className={`w-3 h-3 -mb-1 ${sortConfig.key === k && sortConfig.direction === 'asc' ? 'text-teal-600' : 'text-gray-300'}`} />
                          <ChevronDown className={`w-3 h-3 ${sortConfig.key === k && sortConfig.direction === 'desc' ? 'text-teal-600' : 'text-gray-300'}`} />
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
              {actions && <th className="px-6 py-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((_, j) => (
                    <td key={j} className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
                  ))}
                  {actions && <td className="px-6 py-4"></td>}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-12 text-center text-gray-500">
                  <EmptyState title="No results found" description={emptyMessage} />
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr 
                  key={rowIndex} 
                  className={`hover:bg-gray-50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((col, colIndex) => {
                    const k = getColKey(col);
                    const renderFn = getColRender(col);
                    return (
                      <td key={colIndex} className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                        {renderFn ? renderFn(row[k], row) : row[k]}
                      </td>
                    );
                  })}
                  {actions && (
                    <td className="px-6 py-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="relative inline-block text-left">
                        <button 
                          onClick={() => setOpenDropdown(openDropdown === rowIndex ? null : rowIndex)}
                          className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        {openDropdown === rowIndex && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)}></div>
                            <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                              <div className="py-1">
                                {actions.map((action, actionIndex) => (
                                  <button
                                    key={actionIndex}
                                    onClick={() => {
                                      action.onClick(row);
                                      setOpenDropdown(null);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                                      action.variant === 'danger' ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                  >
                                    {action.icon && <action.icon className="w-4 h-4" />}
                                    {action.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && !loading && totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to <span className="font-medium">{Math.min(currentPage * pageSize, sortedData.length)}</span> of <span className="font-medium">{sortedData.length}</span> results
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
