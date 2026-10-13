'use client';

import { useTranslations } from 'next-intl';
import { Zap, Star, MapPin, Navigation } from 'lucide-react';
import BaseCard from '../../common/baseCard/baseCard';
import Button from '../../common/button/button';
import Text from '../../common/text';
import { cn } from '@/utils';
import { directionsUrl } from './stationUtils';

export default function StationRow({
  station,
  active = false,
  interactive = true,
  withNavigate = false,
  onSelect,
  onNavigate,
}) {
  const t = useTranslations('evLanding');

  return (
    <BaseCard
      onClick={interactive ? () => onSelect?.(station.id) : undefined}
      className={cn(
        'flex flex-row flex-wrap items-center gap-3 rounded-xl p-4 transition-colors',
        interactive && 'cursor-pointer',
        active
          ? 'bg-[#f3f6fd] border-[#dfe7fb]'
          : cn('border-[#f0f0f0]', interactive && 'hover:bg-gray-50'),
      )}
    >
      <div
        className={cn(
          'grid size-10 shrink-0 place-items-center rounded-xl',
          active ? 'bg-primary-100 text-primary' : 'bg-gray-100 text-gray-400',
        )}
      >
        <Zap className="size-5" />
      </div>
      <div className="flex-1 min-w-0">
        <Text weight="semibold" className="text-sm text-gray-900 line-clamp-1">
          {station.name}
        </Text>
        <Text className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
          <MapPin className="size-3.5 shrink-0" />
          <span className="line-clamp-1">
            {station.area}
            {station.distance ? ` · ${station.distance}` : ''}
          </span>
        </Text>
      </div>
      {station.rating != null && (
        <Text className="flex shrink-0 items-center gap-1 text-xs font-semibold text-gray-700">
          <Star className="size-3.5 fill-[#f5b301] text-[#f5b301]" />
          {station.rating}
        </Text>
      )}
      {withNavigate && active && (
        <Button
          href={directionsUrl(station)}
          target="_blank"
          onClick={() => onNavigate?.(station)}
          icon={<Navigation className="size-4" />}
          className="mt-2 w-full"
        >
          {t('navigate')}
        </Button>
      )}
    </BaseCard>
  );
}
