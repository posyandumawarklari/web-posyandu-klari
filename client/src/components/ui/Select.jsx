import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(
  ({ className = '', error, label, helperText, children, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-content dark:text-gray-300 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            className={`
              w-full appearance-none rounded-lg border bg-white dark:bg-gray-900 text-content dark:text-white 
              focus:outline-none focus:ring-2 transition-all
              disabled:opacity-50 disabled:bg-surface-50 dark:disabled:bg-gray-800
              ${error ? 'border-status-danger focus:border-status-danger focus:ring-red-500/20' : 'border-surface-200 dark:border-gray-700 focus:border-primary-400 focus:ring-primary-400/20'}
              px-4 py-2.5 pr-10 text-sm
              ${className}
            `}
            ref={ref}
            {...props}
          >
            {children}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-content-muted">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error && <p className="mt-1.5 text-xs text-status-danger">{error}</p>}
        {helperText && !error && (
          <p className="mt-1.5 text-xs text-content-muted dark:text-gray-400">{helperText}</p>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';

export default Select;
