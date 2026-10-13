'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { cn } from '@/utils';

export const ACTION_MENU_CONTENT_CLASS = 'min-w-[240px] rounded-lg p-1.5';

const ICON_VARIANT_CLASS = {
  primary: {
    bg: 'bg-primary-100',
    icon: 'text-primary',
  },
  success: {
    bg: 'bg-green-50',
    icon: 'text-green-600',
  },
  danger: {
    bg: 'bg-red-50',
    icon: 'text-red-600',
  },
};

export default function DropdownMenuIconItem({
  icon: Icon,
  variant = 'primary',
  children,
  className,
  ...props
}) {
  const variantClass =
    ICON_VARIANT_CLASS[variant] ?? ICON_VARIANT_CLASS.primary;

  return (
    <DropdownMenuItem
      className={cn('cursor-pointer gap-3 rounded-md px-1.5 py-1.5', className)}
      {...props}
    >
      <span
        className={cn(
          'flex size-7 shrink-0 items-center justify-center rounded-full',
          variantClass.bg,
        )}
      >
        <Icon className={cn('size-3.5', variantClass.icon)} />
      </span>
      {children}
    </DropdownMenuItem>
  );
}
