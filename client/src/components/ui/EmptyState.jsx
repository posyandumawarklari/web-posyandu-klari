import { FolderOpen } from 'lucide-react';

export default function EmptyState({ 
  icon: Icon = FolderOpen, 
  title = 'Tidak ada data', 
  description = 'Belum ada data yang dapat ditampilkan saat ini.',
  action,
  className = ''
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 border-dashed ${className}`}>
      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-slate-400 dark:text-slate-500" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
        {description}
      </p>
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
}
