import { forwardRef } from 'react';

const Textarea = forwardRef(({ className = '', error, label, helperText, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        className={`
          w-full rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white 
          placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all
          disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-slate-800
          ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-300 dark:border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/20'}
          px-4 py-3 text-sm min-h-[100px] resize-y
          ${className}
        `}
        ref={ref}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
      {helperText && !error && (
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      )}
    </div>
  );
});
Textarea.displayName = 'Textarea';

export default Textarea;
