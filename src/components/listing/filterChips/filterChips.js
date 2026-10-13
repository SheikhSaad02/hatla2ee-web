'use client';

import { createLocaleStringGetter } from '@/utils/general';
import { cn } from '@/utils';
import FilterChipItem from './filterChipItem';
import Button from '@/components/common/button/button';
import { useTranslations } from 'next-intl';
import { appPaths } from '@/constants';
import { useRouter } from '@/i18n/navigation';

const FilterChips = ({
  chipsData,
  locale,
  onClick = () => {},
  pathOnClear = appPaths.usedCarsListingsSearch,
  renderQuickFilters,
  hideChipKeys = [],
  onNonQuickChipClick,
  showClearAll = true,
}) => {
  const t = createLocaleStringGetter(locale);
  const router = useRouter();
  const trans = useTranslations('usedCarsListings');
  const commonT = useTranslations('common');

  const quickFilterParts = renderQuickFilters ? renderQuickFilters() : null;

  return (
    <div
      className={cn('flex gap-2 items-center overflow-x-auto hide-scrollbar')}
    >
      {quickFilterParts?.applied}

      {!!chipsData?.length && (
        <>
          {chipsData
            ?.filter((chip) => !hideChipKeys.includes(chip.key))
            .map((chip, index) => {
            return (
              <FilterChipItem
                key={index}
                label={t(chip, 'label', commonT)}
                onRemove={() => onClick(chip.key)}
                onClick={onNonQuickChipClick}
              />
            );
          })}
        </>
      )}

      {quickFilterParts?.unapplied}

      {!!chipsData?.length && showClearAll &&(
        <Button
          onClick={() => {
            router.push(pathOnClear);
          }}
          size="sm"
          variant="ghost"
          className="p-0 hover:text-destructive hover:bg-transparent"
        >
          {trans('Clear All')} {chipsData.length > 0 && `(${chipsData.length})`}
        </Button>
      )}
    </div>
  );
};

export default FilterChips;
