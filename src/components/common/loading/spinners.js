'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils';

export function LoadingSpinner({
  size = 'md',
  text = 'Loading...',
  className,
}) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center space-y-2',
        className,
      )}
    >
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-blue-600`}
      />
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  );
}

export function LoadingDots({ className }) {
  return (
    <div className={cn('flex space-x-1', className)}>
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton
          key={index}
          className="h-2 w-2 rounded-full animate-pulse"
          style={{
            animationDelay: `${index * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
}
