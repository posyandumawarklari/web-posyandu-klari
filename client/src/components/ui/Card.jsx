import { forwardRef } from 'react';

const Card = forwardRef(({ className = '', children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});
Card.displayName = 'Card';

const CardHeader = forwardRef(({ className = '', children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`flex flex-col space-y-1.5 p-6 border-b border-slate-100 dark:border-slate-700/50 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef(({ className = '', children, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      className={`text-lg font-semibold leading-none tracking-tight text-slate-900 dark:text-white ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
});
CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef(({ className = '', children, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={`text-sm text-slate-500 dark:text-slate-400 ${className}`}
      {...props}
    >
      {children}
    </p>
  );
});
CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef(({ className = '', children, ...props }, ref) => {
  return (
    <div ref={ref} className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
});
CardContent.displayName = 'CardContent';

const CardFooter = forwardRef(({ className = '', children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`flex items-center p-6 pt-0 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
