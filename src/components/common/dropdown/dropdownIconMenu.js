'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import DropdownMenuIconItem, { ACTION_MENU_CONTENT_CLASS } from './dropdownMenuIconItem';

export default function DropdownIconMenu({
  trigger,
  items = [],
  align = 'end',
  contentClassName = ACTION_MENU_CONTENT_CLASS,
}) {
  if (!items.length) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align={align} className={contentClassName}>
        {items.map(
          ({ key, icon, variant, label, disabled, onSelect, className }) => (
            <DropdownMenuIconItem
              key={key}
              icon={icon}
              variant={variant}
              disabled={disabled}
              className={className}
              onSelect={onSelect}
            >
              {label}
            </DropdownMenuIconItem>
          ),
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
