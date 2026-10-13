'use client';

import { Plus } from 'lucide-react';

import Button from '@/components/common/button/button';
import { cn } from '@/utils';

export default function PanelBannerActionButton({
  label,
  onClick,
  className,
  icon = <Plus />,
}) {
  return (
    <Button
      type="button"
      size="xl"
      className={cn('mt-4 w-fit', className)}
      icon={icon}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
