import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-primary-800 hover:bg-primary-900 text-white shadow-soft hover:shadow-soft-lg',
  secondary: 'bg-white hover:bg-surface-50 text-content border border-surface-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white dark:border-gray-700',
  outline: 'border border-primary-800 bg-transparent hover:bg-primary-50 text-primary-800 dark:border-primary-400 dark:hover:bg-primary-900/30 dark:text-primary-400',
  ghost: 'bg-transparent hover:bg-surface-100 text-content-muted hover:text-content dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-white',
  danger: 'bg-status-danger hover:bg-red-700 text-white shadow-soft hover:shadow-soft-lg',
};

const sizes = {
  sm: 'h-8 px-4 text-xs rounded-md',
  md: 'h-11 px-6 text-sm rounded-lg',
  lg: 'h-14 px-8 text-base rounded-xl',
  icon: 'h-10 w-10 p-2 rounded-lg',
};

const Button = forwardRef(
  ({ className = '', variant = 'primary', size = 'md', isLoading = false, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:opacity-50 disabled:pointer-events-none';
    const variantClasses = variants[variant];
    const sizeClasses = sizes[size];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);
Button.displayName = 'Button';

export default Button;
