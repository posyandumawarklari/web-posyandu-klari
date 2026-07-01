import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(
  ({ className = '', error, label, helperText, children, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            className={`
              w-full appearance-none rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white 
              focus:outline-none focus:ring-2 transition-all
              disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-slate-800
              ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-300 dark:border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/20'}
              px-4 py-2.5 pr-10 text-sm
              ${className}
            `}
            ref={ref}
            {...props}
          >
            {children}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
        {helperText && !error && (
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';

export default Select;
