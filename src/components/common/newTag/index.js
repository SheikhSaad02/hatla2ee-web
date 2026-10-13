'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils';
import { useTranslations } from 'next-intl';

export default function NewTag({ className }) {
  const t = useTranslations('common');

  return (
    <Badge
      className={cn(
        'inline-flex h-6 w-[38px] shrink-0 items-center justify-center rounded border-none p-0 text-[11px] font-normal leading-none text-white',
        'cursor-default bg-[#FF4500] hover:bg-[#FF4500] pointer-events-none',
        className,
      )}
    >
      {t('New')}
    </Badge>
  );
}
