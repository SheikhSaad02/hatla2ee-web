'use client';

import { cn } from '@/utils';
import { useTranslations } from 'next-intl';
import ComparisonControlHeader from './ComparisonControlHeader';
import ValueCell from './ValueCell';

const AttributeLabelColumn = ({
  hideSimilarities,
  onToggleSimilarities,
  attributes,
  className,
}) => {
  const t = useTranslations('carComparison');

  return (
    <div
      className={cn(
        'w-28 md:w-56 lg:w-72 flex-shrink-0 flex flex-col rounded-lg bg-white',
        className,
      )}
    >
      <ComparisonControlHeader
        hideSimilarities={hideSimilarities}
        onToggleSimilarities={onToggleSimilarities}
      />

      <div className="space-y-0 flex-1">
        {attributes.map((attribute, index) => (
          <ValueCell key={attribute.slug} isLabel>
            <span className="text-xs md:text-base font-medium break-all">
              {t(attribute.label) || attribute.label}
            </span>
          </ValueCell>
        ))}
      </div>
    </div>
  );
};

export default AttributeLabelColumn;
