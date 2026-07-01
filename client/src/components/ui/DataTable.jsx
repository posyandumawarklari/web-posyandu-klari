import { Loader2 } from 'lucide-react';
import EmptyState from './EmptyState';
import Pagination from './Pagination';

/**
 * DataTable Component
 * @param {Object} props
 * @param {Array} props.columns - Array of { header: string, accessor: string | function, className: string }
 * @param {Array} props.data - Array of data objects
 * @param {boolean} props.isLoading - Loading state
 * @param {Object} props.emptyState - { icon, title, description, action } for EmptyState
 * @param {Object} props.pagination - { currentPage, totalPages, onPageChange }
 */
export default function DataTable({
  columns = [],
  data = [],
  isLoading = false,
  emptyState,
  pagination,
}) {
  if (isLoading) {
    return (
      <div className="w-full bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 min-h-[400px] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-4" />
        <p className="text-sm text-slate-500 dark:text-slate-400">Memuat data...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 min-h-[400px] flex items-center justify-center p-6">
        <EmptyState
          title={emptyState?.title || 'Tidak ada data'}
          description={emptyState?.description || 'Belum ada data yang dapat ditampilkan.'}
          icon={emptyState?.icon}
          action={emptyState?.action}
          className="border-none w-full max-w-md"
        />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className={`px-6 py-4 text-sm text-slate-700 dark:text-slate-300 ${col.className || ''}`}
                  >
                    {typeof col.accessor === 'function'
                      ? col.accessor(row)
                      : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.onPageChange}
          />
        </div>
      )}
    </div>
  );
}
