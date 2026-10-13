'use client';

import { cn } from '@/utils';
import { X } from 'lucide-react';
import CarSelectionCard from '../carSelection/carSelectionCard';
import ValueCell from './ValueCell';
import { useTranslations } from 'next-intl';

const EmptyValueColumn = ({
  onAddCar,
  onRemove,
  attributes,
  className,
  isMobile = false,
  hasError = false,
  vehicleCategorySlug,
}) => {
  const t = useTranslations('common');

  return (
    <div
      className={cn(
        'bg-[linear-gradient(to_top,#F4F8FD_0%,white_100%)] lg:flex-1 flex-shrink-0 rounded-lg shadow border flex flex-col max-sm:min-w-48',
        className,
      )}
    >
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 shadow-md hover:bg-gray-50 cursor-pointer"
        >
          <X size={16} className="text-gray-600" />
        </button>
      )}

      <CarSelectionCard
        isMobile={isMobile}
        onSelect={onAddCar}
        placeholder={t('Select a Vehicle')}
        className="border-none shadow-none h-50 md:h-60"
        hasError={hasError}
        categorySlug={vehicleCategorySlug}
      />

      <div className="space-y-0 flex-1">
        {attributes.map((attribute, index) => (
          <ValueCell key={attribute.slug}>
            <span className="text-xs md:text-sm text-gray-400"></span>
          </ValueCell>
        ))}
      </div>
    </div>
  );
};

export default EmptyValueColumn;
