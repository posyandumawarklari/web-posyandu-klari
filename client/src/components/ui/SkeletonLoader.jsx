import React from 'react';

const SkeletonLoader = ({ 
  count = 1, 
  type = 'card', // 'card', 'text', 'avatar', 'table-row'
  className = '' 
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className={`bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm animate-pulse ${className}`}>
            <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="flex gap-2">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
            </div>
          </div>
        );
      case 'text':
        return (
          <div className={`space-y-3 animate-pulse ${className}`}>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        );
      case 'avatar':
        return (
          <div className={`w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse ${className}`}></div>
        );
      case 'table-row':
        return (
          <div className={`flex items-center gap-4 py-3 animate-pulse border-b border-gray-100 dark:border-gray-700 ${className}`}>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 ml-auto"></div>
          </div>
        );
      default:
        return (
          <div className={`bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${className}`}></div>
        );
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <React.Fragment key={idx}>
          {renderSkeleton()}
        </React.Fragment>
      ))}
    </>
  );
};

export default SkeletonLoader;
