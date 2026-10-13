'use client';

import { Check } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { InfoIcon } from '@/icons';
import { useIsMobile } from '@/providers/isMobile';
import { cn } from '@/utils';
import { getLocaleString } from '@/utils/general';
import { Badge } from '../badge/badge';
import Button from '../button/button';
import { Tooltip } from '../tooltip/tooltip';

const Tip = ({ content, isMob, children }) =>
  isMob ? (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        side="top"
        className="w-max border-gray-200 bg-white text-xs text-black"
      >
        {content}
      </PopoverContent>
    </Popover>
  ) : (
    <Tooltip className="w-max border border-gray-200 text-xs" content={content}>
      {children}
    </Tooltip>
  );
const SellableBadges = ({ badges = [], variant = 'detail' }) => {
  const t = useTranslations('common');
  const locale = useLocale();
  const isMob = useIsMobile() ?? false;

  if (!badges?.length) return null;

  const isCard = variant === 'card';
  const label = (badge) => getLocaleString(badge, 'title', locale, t);
  const disclaimer = t('badges_disclaimer');

  const visible = isCard ? badges.slice(0, 1) : badges;
  const hidden = isCard ? badges.slice(1) : [];
  const hiddenLabels = hidden.map(label).join(', ');

  const chip = cn(
    'gap-1 font-medium text-gray-900',
    isCard
      ? 'bg-white shadow-sm px-1.5 h-5 text-[11px]'
      : 'bg-gray-50 border-gray-100 px-4 py-1.5 text-xs lg:text-sm',
  );

  const pills = (
    <div className={cn('flex gap-2', !isCard && 'flex-wrap items-start')}>
      {visible.map((badge) => {
        const node = (
          <Badge key={badge.slug} variant="secondary" className={chip}>
            <Check className={isCard ? 'size-3' : 'size-3.5 lg:size-4'} />
            {label(badge)}
          </Badge>
        );
        return isCard ? (
          <Tip key={badge.slug} isMob={isMob} content={disclaimer}>
            {node}
          </Tip>
        ) : (
          node
        );
      })}

      {hidden.length > 0 && (
        <Tip isMob={isMob} content={hiddenLabels}>
          <Badge variant="secondary" className={chip} aria-label={hiddenLabels}>
            +{hidden.length}
          </Badge>
        </Tip>
      )}

      {!isCard && isMob && (
        <Tip isMob content={disclaimer}>
          <Button
            variant="ghost"
            size="icon"
            aria-label={disclaimer}
            className="size-8 self-center text-gray-500"
          >
            <InfoIcon className="size-4" />
          </Button>
        </Tip>
      )}
    </div>
  );

  if (isCard || isMob) return pills;

  return (
    <Tooltip
      className="w-max border border-gray-200 text-xs"
      content={disclaimer}
    >
      <div className="w-fit">{pills}</div>
    </Tooltip>
  );
};

export default SellableBadges;
