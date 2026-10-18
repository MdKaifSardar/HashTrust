import React, { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const PAGE_SIZE_OPTIONS = [25, 50, 100, 200];

const LogsComp: React.FC<{ logs: Array<any> }> = ({ logs }) => {
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [typeFilter, setTypeFilter] = useState("All");

  // Get all types for filter dropdown
  const allTypes = Array.from(
    new Set(logs.map((log) => log.type).filter(Boolean))
  );

  // Filter logs by type
  const filteredLogs =
    typeFilter === "All"
      ? logs
      : logs.filter((log) => log.type === typeFilter);

  // Pagination
  const totalLogs = filteredLogs.length;
  const totalPages = Math.ceil(totalLogs / pageSize);
  const paginatedLogs = filteredLogs
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice((page - 1) * pageSize, page * pageSize);

  // Accordion toggle
  const handleToggle = (idx: number) => {
    setExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-blue-100 dark:border-slate-800 shadow-sm w-full md:w-[52vw] lg:w-[70vw] xl:w-[75vw] p-6 mt-8 overflow-x-auto transition-colors">
      <h3 className="text-lg font-bold text-blue-700 dark:text-cyan-400 mb-4 transition-colors">API Request Logs</h3>
      {/* Filter and page size controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="font-semibold text-blue-700 dark:text-slate-300 text-sm">Filter by Type:</label>
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="border border-blue-300 dark:border-slate-700 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-cyan-500/50 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm transition-colors"
          >
            <option value="All">All</option>
            {allTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="font-semibold text-blue-700 dark:text-slate-300 text-sm">Logs per page:</label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="border border-blue-300 dark:border-slate-700 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-cyan-500/50 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm transition-colors"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Pagination controls */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-600 dark:text-slate-400">
          Showing {paginatedLogs.length} of {totalLogs} logs
        </span>
        <div className="flex items-center gap-2">
          <button
            className="px-2 py-1 rounded bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-slate-300 font-semibold hover:bg-gray-300 dark:hover:bg-slate-700 disabled:opacity-50 transition"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>
          <span className="text-sm font-semibold text-blue-700 dark:text-cyan-400">
            Page {page} of {totalPages || 1}
          </span>
          <button
            className="px-2 py-1 rounded bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-slate-300 font-semibold hover:bg-gray-300 dark:hover:bg-slate-700 disabled:opacity-50 transition"
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      </div>
      {/* Logs accordion */}
      <div className="flex flex-col gap-4">
        {paginatedLogs.length === 0 ? (
          <div className="text-gray-600 dark:text-slate-400">No logs available.</div>
        ) : (
          paginatedLogs.map((log, idx) => {
            const globalIdx = (page - 1) * pageSize + idx;
            const isOpen = expanded[globalIdx] || false;
            return (
              <div
                key={globalIdx}
                className="border border-gray-200 dark:border-slate-800 rounded-lg bg-gray-50 dark:bg-slate-800/60 shadow-sm transition-colors"
              >
                <button
                  className="w-full flex justify-between items-center px-4 py-3 focus:outline-none"
                  onClick={() => handleToggle(globalIdx)}
                  aria-expanded={isOpen}
                >
                  <div className="flex gap-4 items-center flex-wrap">
                    <span className="text-xs font-semibold text-blue-700 dark:text-cyan-300 bg-blue-100 dark:bg-cyan-950/60 border border-blue-200 dark:border-cyan-800/50 px-2 py-1 rounded">
                      {new Date(log.time).toLocaleString()}
                    </span>
                    <span className="text-xs font-semibold text-green-700 dark:text-emerald-300 bg-green-100 dark:bg-emerald-950/60 border border-green-200 dark:border-emerald-800/50 px-2 py-1 rounded">
                      {log.type}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded border ${
                        log.success
                          ? "bg-green-100 dark:bg-emerald-950/60 text-green-700 dark:text-emerald-300 border-green-200 dark:border-emerald-800/50"
                          : "bg-red-100 dark:bg-rose-950/60 text-red-700 dark:text-rose-300 border-red-200 dark:border-rose-800/50"
                      }`}
                    >
                      {log.success ? "Success" : "Failed"}
                    </span>
                    <span className="text-xs font-semibold bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700 px-2 py-1 rounded">
                      Status: {log.status ?? "N/A"}
                    </span>
                  </div>
                  <span className="text-lg text-blue-700 dark:text-cyan-400">
                    {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4">
                    <div className="mb-2">
                      <span className="font-semibold text-gray-700 dark:text-slate-300 text-sm">Request:</span>
                      <div className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded p-2 text-xs mt-1 w-full max-w-full overflow-x-auto font-mono">
                        <pre className="whitespace-pre-wrap break-words w-full max-w-full">
                          {log.request
                            ? JSON.stringify(JSON.parse(log.request), null, 2)
                            : "N/A"}
                        </pre>
                      </div>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700 dark:text-slate-300 text-sm">Response:</span>
                      <div className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded p-2 text-xs mt-1 w-full max-w-full overflow-x-auto font-mono">
                        <pre className="whitespace-pre-wrap break-words w-full max-w-full">
                          {log.response
                            ? JSON.stringify(JSON.parse(log.response), null, 2)
                            : "N/A"}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default LogsComp;
