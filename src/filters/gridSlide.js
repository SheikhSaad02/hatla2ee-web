import { ChipWithIcon } from '@/components/common/chip-with-icon/chip-with-icon';
import NextLink from '@/components/common/nextLink';
import OptionCard from '@/components/common/optionCard/optionCard';
import { cn } from '@/utils';
import { createLocaleStringGetter, getAsset } from '@/utils/general';
import { useLocale, useTranslations } from 'next-intl';
import { PAGE_SECTIONS } from '@/services/analyticsService/constants';
const GridSlide = ({ item, type, index, className, page_type = '', tabLabel = '', pageSection = '', labelClassName = '' }) => {
  const locale = useLocale();
  const t = createLocaleStringGetter(locale);
  const commonT = useTranslations('common');  
  if (type === 'badge') {
    return (
      <ChipWithIcon
        href={item?.link || `/car/${item?.slug}`}
        hrefTitle={item?.hrefTitle}
        key={index}
        optionClickGaEvent="popular_search_option_click"
        tabLabel={tabLabel}
        optionText={
          tabLabel === 'price-range'
            ? `Under ${item?.slug}`
            : t(item, 'label', commonT)
        }
        pageType={page_type}
        pageSection={pageSection || PAGE_SECTIONS.POPULAR_SEARCHES_WIDGET}
        label={
          <span className={cn(labelClassName)}>
            {t(item, 'label')}{' '}
            
            {item?.count ? (
              <span className="text-xs text-dim">({item?.count})</span>
            ) : (
              ''
            )}
          </span>
        }
        className={cn('justify-center capitalize px-2', className)}
      />
    );
  }
  const spriteClass = item?.spriteClass;
  return (
    <NextLink
      title={item?.hrefTitle}
      href={item?.link || `/car/${item?.value || item.slug}`}
      key={index}
      className={className}
    >
      <OptionCard
        key={index}
        optionClickGaEvent="popular_search_option_click"
        tabLabel={tabLabel}
        optionText={
          tabLabel === 'price-range'
            ? `Under ${item?.slug}`
            : t(item, 'label', commonT)
        }
        pageType={page_type}
        pageSection={pageSection || PAGE_SECTIONS.POPULAR_SEARCHES_WIDGET}
        label={t(item, 'label', commonT)}
        subLabel={item?.count || ''}
        // Use sprite if available, otherwise fall back to image
        spriteClassName={spriteClass}
        image={
          !spriteClass && item?.src
            ? item?.src
            : getAsset('/assets/car-placeholder.svg')
        }
        width={100}
        height={100}
        imageClassName={'w-auto h-[50px] flex-shrink-0'}
        contentClassName="flex gap-1"
        labelClassName="text-sm truncate max-w-[100px] md:max-w-[140px]"
        subLabelClassName="lg:text-xs"
        src={item?.src}
      />
    </NextLink>
  );
};
export default GridSlide;
