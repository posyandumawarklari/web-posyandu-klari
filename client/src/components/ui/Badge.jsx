import { forwardRef } from 'react';

const variants = {
  default: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
  primary: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  danger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
};

const Badge = forwardRef(({ className = '', variant = 'default', children, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
});
Badge.displayName = 'Badge';

export default Badge;
