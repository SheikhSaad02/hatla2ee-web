'use client';

import BaseCard from '@/components/common/baseCard/baseCard';
import Button from '@/components/common/button/button';
import { GARAGE_CARD_CLASS } from '@/components/car-maintenance/styles';
import NextImage from '@/components/common/nextImage';
import { cn } from '@/utils';
import { getAsset } from '@/utils/general';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function AddCarPlaceholderCard({ onClick, className }) {
  const t = useTranslations('carMaintenance');

  return (
    <BaseCard
      className={cn(
        GARAGE_CARD_CLASS,
        'flex flex-col justify-between rounded-2xl border border-gray-200 bg-gray-50/80 p-4 shadow-none',
        className,
      )}
    >
      <div className="flex flex-1 items-center justify-center overflow-hidden">
        <NextImage
          src={getAsset('/assets/garage-placeholder.webp')}
          alt=""
          width={180}
          height={110}
          className="max-h-[140px] w-full max-w-[220px] object-contain opacity-60"
        />
      </div>
      <Button onClick={onClick} className="w-full shrink-0" size="lg">
        <Plus className="size-4" />
        {t('add_your_car')}
      </Button>
    </BaseCard>
  );
}
