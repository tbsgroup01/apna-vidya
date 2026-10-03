import React, { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, X, Trash2 } from "lucide-react";
import EmptyState from "./EmptyState";

const DataTable = ({
  columns = [],
  data = [],
  searchKey = "name",
  searchPlaceholder = "Search records...",
  filterTabs = [],
  filterKey = "status",
  initialFilter = "All",
  pageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  onRowClick = null,
  selectable = false,
  selectedIds: externalSelectedIds,
  onSelectionChange = null,
  onBulkDelete = null,
  bulkDeleteLabel = "Delete Selected",
  emptyTitle = "No records found",
  emptyDescription = "Try adjusting your search query or filter.",
}) => {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [sortKey, setSortKey] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [internalSelectedIds, setInternalSelectedIds] = useState([]);

  const currentSelectedIds =
    externalSelectedIds !== undefined && externalSelectedIds !== null
      ? externalSelectedIds
      : internalSelectedIds;

  const updateSelected = (ids) => {
    if (externalSelectedIds === undefined || externalSelectedIds === null) {
      setInternalSelectedIds(ids);
    }
    if (onSelectionChange) onSelectionChange(ids);
  };

  const filteredData = useMemo(() => {
    let result = [...data];

    const normalizedFilter =
      typeof activeFilter === "object" ? activeFilter.value : activeFilter;

    if (
      normalizedFilter &&
      String(normalizedFilter).toLowerCase() !== "all"
    ) {
      result = result.filter(
        (item) =>
          String(item[filterKey]).toLowerCase() ===
          String(normalizedFilter).toLowerCase()
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((item) => {
        if (typeof searchKey === "function") {
          return searchKey(item, q);
        }
        const val = item[searchKey];
        if (typeof val === "string") return val.toLowerCase().includes(q);
        return Object.values(item).some(
          (v) => typeof v === "string" && v.toLowerCase().includes(q)
        );
      });
    }

    if (sortKey) {
      result.sort((a, b) => {
        let valA = a[sortKey];
        let valB = b[sortKey];
        if (valA < valB) return sortDirection === "asc" ? -1 : 1;
        if (valA > valB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, search, activeFilter, filterKey, searchKey, sortKey, sortDirection]);

  const totalPages = Math.ceil(filteredData.length / currentPageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * currentPageSize;
    return filteredData.slice(start, start + currentPageSize);
  }, [filteredData, currentPage, currentPageSize]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const handleSelectAll = (e) => {
    const pageIds = paginatedData.map((d) => d.id);
    if (e.target.checked) {
      const combined = Array.from(new Set([...currentSelectedIds, ...pageIds]));
      updateSelected(combined);
    } else {
      const remaining = currentSelectedIds.filter((id) => !pageIds.includes(id));
      updateSelected(remaining);
    }
  };

  const handleSelectOne = (id) => {
    const newSelected = currentSelectedIds.includes(id)
      ? currentSelectedIds.filter((item) => item !== id)
      : [...currentSelectedIds, id];
    updateSelected(newSelected);
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
      {(searchKey || (filterTabs && filterTabs.length > 0)) && (
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 bg-white">
          {searchKey && (
            <div className="relative flex-1 max-w-sm">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px]late-400"
              />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-8 text-xs text-[13px]late-800 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[13px]late-400 hover:text-[13px]late-600 cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          )}

          {filterTabs && filterTabs.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
              {filterTabs.map((tab, idx) => {
                const tabLabel = typeof tab === "object" ? tab.label : tab;
                const tabValue = typeof tab === "object" ? tab.value : tab;
                const isSelected =
                  typeof activeFilter === "object"
                    ? activeFilter.value === tabValue
                    : String(activeFilter).toLowerCase() ===
                    String(tabValue).toLowerCase() ||
                    String(activeFilter).toLowerCase() ===
                    String(tabLabel).toLowerCase();

                return (
                  <button
                    key={
                      typeof tab === "object"
                        ? tab.value || tab.label || idx
                        : tab
                    }
                    type="button"
                    onClick={() => {
                      setActiveFilter(tabValue);
                      setCurrentPage(1);
                    }}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${isSelected
                      ? "bg-[#FD8006] text-white shadow-2xs"
                      : "bg-slate-100 text-[13px]late-600 hover:bg-slate-200/80"
                      }`}
                  >
                    {tabLabel}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {selectable && currentSelectedIds.length > 0 && (
        <div className="flex items-center justify-between bg-blue-50/90 px-4 py-2.5 border-b border-blue-100">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center h-5 px-2 rounded-full bg-[#FD8006] text-[13px] font-bold text-white">
              {currentSelectedIds.length}
            </span>
            <span className="text-xs font-semibold text-blue-900">
              item{currentSelectedIds.length > 1 ? "s" : ""} selected
            </span>
            <button
              type="button"
              onClick={() => updateSelected([])}
              className="text-xs text-blue-600 hover:text-blue-800 underline font-medium ml-2 cursor-pointer"
            >
              Clear selection
            </button>
          </div>
          {onBulkDelete && (
            <button
              type="button"
              onClick={() => onBulkDelete(currentSelectedIds)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-red-700 active:scale-95 transition-all cursor-pointer"
            >
              <Trash2 size={13} />
              <span>{bulkDeleteLabel} ({currentSelectedIds.length})</span>
            </button>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/75 text-[13px] font-bold uppercase tracking-wider text-[13px]late-500">
              {selectable && (
                <th className="px-4 py-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      paginatedData.length > 0 &&
                      paginatedData.every((d) => currentSelectedIds.includes(d.id))
                    }
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3.5 whitespace-nowrap ${col.sortable ? "cursor-pointer select-none hover:text-[13px]late-800" : ""
                    } ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"}`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div
                    className={`inline-flex items-center gap-1.5 ${col.align === "right"
                      ? "justify-end w-full"
                      : col.align === "center"
                        ? "justify-center w-full"
                        : ""
                      }`}
                  >
                    <span>{col.header}</span>
                    {col.sortable && (
                      <ArrowUpDown
                        size={12}
                        className={`text-[13px]late-400 ${sortKey === col.key ? "text-blue-600" : ""
                          }`}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`transition-colors hover:bg-slate-50/70 ${onRowClick ? "cursor-pointer" : ""
                    }`}
                >
                  {selectable && (
                    <td
                      className="px-4 py-3.5 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={currentSelectedIds.includes(row.id)}
                        onChange={() => handleSelectOne(row.id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3.5 ${col.align === "right"
                        ? "text-right"
                        : col.align === "center"
                          ? "text-center"
                          : "text-left"
                        }`}
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="p-8">
                  <EmptyState title={emptyTitle} description={emptyDescription} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredData.length > 0 && (
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between border-t border-slate-100 bg-white text-xs text-[13px]late-500">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              Showing{" "}
              <span className="font-semibold text-[13px]late-800">
                {(currentPage - 1) * currentPageSize + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-[13px]late-800">
                {Math.min(currentPage * currentPageSize, filteredData.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[13px]late-800">
                {filteredData.length}
              </span>{" "}
              results
            </div>

            {pageSizeOptions && pageSizeOptions.length > 0 && (
              <div className="flex items-center gap-2">
                <span>Rows:</span>
                <select
                  value={currentPageSize}
                  onChange={(e) => {
                    setCurrentPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="rounded-lg border border-slate-200 bg-slate-50/50 px-2 py-1 text-xs font-semibold text-[13px]late-700 focus:border-blue-600 focus:bg-white focus:outline-none transition-all cursor-pointer"
                >
                  {pageSizeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt} / page
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 font-medium hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronLeft size={14} />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))
                .map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`h-7 w-7 rounded-lg font-bold text-xs transition-colors cursor-pointer ${currentPage === page
                      ? "bg-[#FD8006] text-white"
                      : "hover:bg-slate-100 text-[13px]late-700"
                      }`}
                  >
                    {page}
                  </button>
                ))}
            </div>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 font-medium hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
