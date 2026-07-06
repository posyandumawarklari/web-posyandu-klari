import { forwardRef } from 'react';

const Input = forwardRef(
  ({ className = '', type = 'text', error, leftIcon, rightIcon, label, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-content dark:text-gray-300 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-content-muted">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            className={`
              w-full rounded-lg border bg-white dark:bg-gray-900 text-content dark:text-white 
              placeholder:text-content-muted focus:outline-none focus:ring-2 transition-all
              disabled:opacity-50 disabled:bg-surface-50 dark:disabled:bg-gray-800
              ${error ? 'border-status-danger focus:border-status-danger focus:ring-red-500/20' : 'border-surface-200 dark:border-gray-700 focus:border-primary-400 focus:ring-primary-400/20'}
              ${leftIcon ? 'pl-10' : 'px-4'}
              ${rightIcon ? 'pr-10' : 'pr-4'}
              py-2.5 text-sm
              ${className}
            `}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-content-muted">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-status-danger">{error}</p>}
        {helperText && !error && (
          <p className="mt-1.5 text-xs text-content-muted dark:text-gray-400">{helperText}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export default Input;
