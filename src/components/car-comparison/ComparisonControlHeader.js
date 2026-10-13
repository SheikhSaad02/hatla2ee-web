'use client';

import React from 'react';
import { cn } from '@/utils';
import Toggle from '@/components/common/toggle/toggle';
import { useTranslations } from 'next-intl';

const ComparisonControlHeader = ({
  hideSimilarities,
  onToggleSimilarities,
  className,
}) => {
  const t = useTranslations('carComparison');
  return (
    <div
      className={cn(
        'flex flex-col justify-start md:justify-between h-50 md:h-60 sticky md:top-10 z-10 bg-white',
        className,
      )}
    >
      <div className="flex justify-start bg-primary-50 rounded-lg p-3 lg:p-4 md:mt-auto">
        <Toggle
          checked={hideSimilarities}
          onCheckedChange={onToggleSimilarities}
          containerClassName="bg-transparent max-sm:items-start max-sm:flex-col lg:flex-1 justify-between"
          label={t('Hide similarities')}
          labelClassName="text-xs md:text-sm"
        />
      </div>
    </div>
  );
};

export default ComparisonControlHeader;
