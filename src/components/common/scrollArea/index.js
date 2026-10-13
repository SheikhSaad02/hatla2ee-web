import { cn } from '@/utils';

export default function ScrollArea({
  orientation = 'vertical',
  showScrollbars = false,
  className,
  children,
  ...props
}) {
  return (
    <div
      className={cn(
        // 'w-full h-full',
        'lg:overscroll-contain',
        orientation === 'horizontal'
          ? 'overflow-x-auto overflow-y-hidden'
          : 'overflow-y-auto overflow-x-hidden',
        !showScrollbars && 'hide-scrollbar',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
