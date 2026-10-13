import { cn } from '@/utils';

/**
 * Generic "arrowed" card: an optional colored header, a body, and a downward
 * pointer/triangle centered at the bottom. Header/body/pointer styling is passed
 * by the caller so it can be reused for different callouts.
 */
export default function PointerCard({
  header,
  headerClassName,
  children,
  bodyClassName,
  pointerClassName,
  className,
}) {
  return (
    <div className={cn('flex flex-col', className)}>
      {header && (
        <div className={cn('rounded-t-lg text-center', headerClassName)}>
          {header}
        </div>
      )}
      <div className={cn('relative flex-1 rounded-b-lg', bodyClassName)}>
        {children}
        <span
          className={cn(
            'absolute start-1/2 -translate-x-1/2 -bottom-2 h-0 w-0',
            'border-x-8 border-x-transparent border-t-8',
            pointerClassName,
          )}
        />
      </div>
    </div>
  );
}
