import React from 'react';
import TextWithIcon from '../textWithIcon/textWithIcon';
import { getLocaleString, mapFeaturesToStrings } from '@/utils/general';
import { useLocale } from 'next-intl';
import { cn } from '@/utils';
import { translations } from '@/data/tFunctionTranslation';
import {
  IconCalendarFill,
  IconFuelPumpFill,
  IconSpeedometerFill,
  IconTransmissionFill,
  IconWorldFill,
} from '@/icons/basicSvgs';
const transformSpecificationList = (items = [], isMob, locale = 'en') => {
  const iconMap = {
    year: IconCalendarFill,
    km: IconSpeedometerFill,
    fuel: IconFuelPumpFill,
    transmission: IconTransmissionFill,
    spec: IconWorldFill,
  };

  return items?.map(({ label, label_l1, slug }) => {
    const IconComponent = iconMap[slug];
    if (!label) return null;

    let displayLabel = label;
    if (slug && translations?.[locale]?.[slug]) {
      displayLabel = translations[locale][slug](label);
    }

    return {
      label: displayLabel,
      label_l1,
      slug,
      icon: IconComponent ? <IconComponent size={isMob ? 14 : 18} /> : null,
    };
  });
};

const SpecificationList = ({
  specificationList = [],
  className,
  titleClassName,
  isMob,
}) => {
  const locale = useLocale();
  const list = transformSpecificationList(specificationList, isMob, locale);
  return (
    <div className="flex gap-2 flex-wrap">
      {list?.map((tag) => {
        if (!tag?.label) return null;

        return (
          <TextWithIcon
            key={tag?.slug}
            className={cn(
              'gap-1 bg-gray-50 px-4 py-1.5 rounded-md text-xs cursor-default lg:text-sm text-gray-600 dark:bg-gray-700 dark:text-gray-200 border border-gray-100 dark:border-gray-600',
              className,
            )}
            icon={tag?.icon}
            titleClassName={cn(
              'font-medium text-xs lg:text-sm',
              titleClassName,
            )}
            title={getLocaleString(tag, 'label', locale)}
          />
        );
      })}
    </div>
  );
};

export default SpecificationList;
