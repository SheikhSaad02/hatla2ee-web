'use client';

import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils';
import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Accordion({
  items,
  allowMultiple = false,
  defaultOpen = [],
  className,
  itemClassName,
  headerClassName,
  triggerTextClassName,
  suffixClassName,
  chevronClassName,
  contentClassName,
  contentWrapperClassName,
  itemDivider = true,
  dropdownOpen = false,
  onItemOpen,
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [openItems, setOpenItems] = useState(() => {
    const initial = {};
    defaultOpen.forEach((id) => {
      initial[id] = true;
    });
    return initial;
  });

  useEffect(() => {
    if (searchParams.toString() && !dropdownOpen) {
      setOpenItems({});
    }
  }, [searchParams.toString(), pathname]);

  const toggleItem = (id) => {
    if (!openItems[id]) onItemOpen?.(id);
    setOpenItems((prev) => {
      if (allowMultiple) {
        return { ...prev, [id]: !prev[id] };
      } else {
        return { [id]: !prev[id] };
      }
    });
  };

  return (
    <div className={cn('w-full space-y-4', className)}>
      {items.map((item) => {
        const isOpen = !!openItems[item.id];
        return (
          <div
            key={item.id}
            className={cn(
              itemDivider && 'border-b last:border-b-0',
              itemClassName,
            )}
          >
            <div
              onClick={() => toggleItem(item.id)}
              className={cn(
                'flex w-full items-center justify-between py-2 cursor-pointer',
                headerClassName,
              )}
              type="button"
              aria-expanded={isOpen}
            >
              <div
                className={cn(
                  'min-w-0 text-sm font-medium',
                  triggerTextClassName,
                )}
              >
                {item.trigger}
              </div>
              <div className="flex items-center gap-2">
                {item?.suffix ? (
                  <span
                    className={cn(
                      'text-gray-light text-sm max-w-24 truncate',
                      suffixClassName,
                    )}
                  >
                    {item.suffix}
                  </span>
                ) : (
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform text-primary-700 duration-300',
                      isOpen && 'rotate-180',
                      chevronClassName,
                    )}
                    strokeWidth={3}
                  />
                )}
              </div>
            </div>

            <div
              id={`content-${item.id}`}
              className={cn(
                'grid transition-all duration-300 ease-in-out overflow-hidden',
                isOpen
                  ? 'grid-rows-[1fr] opacity-100'
                  : 'grid-rows-[0fr] opacity-0',
                contentWrapperClassName,
              )}
              aria-hidden={!isOpen}
            >
              <div className="min-h-0">
                <div className={cn('pb-2', contentClassName)}>
                  {item?.content || item.getContent()}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
