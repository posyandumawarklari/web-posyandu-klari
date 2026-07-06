import { forwardRef } from 'react';

const variants = {
  default: 'bg-surface-100 text-content-muted border border-surface-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
  primary: 'bg-primary-50 text-primary-800 border border-primary-100 dark:bg-primary-900/30 dark:text-primary-300 dark:border-primary-800/50',
  success: 'bg-green-50 text-status-success border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50',
  warning: 'bg-yellow-50 text-status-warning border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800/50',
  danger: 'bg-red-50 text-status-danger border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50',
  info: 'bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50',
};

const Badge = forwardRef(({ className = '', variant = 'default', children, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
});
Badge.displayName = 'Badge';

export default Badge;
