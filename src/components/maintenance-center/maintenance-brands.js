import { cn } from '@/utils';
import { getLocaleString } from '@/utils/general';
import { useLocale, useTranslations } from 'next-intl';
import { MultilineCarousel } from '../common/carousel/multlineCarousel';
import NextLink from '../common/nextLink';
import OptionCard from '../common/optionCard/optionCard';
import Text from '../common/text';

const MantainenanceCenterBrands = ({
  brandsData,
  containerClassName,
  title,
  titleClass,
  isMobile,
  rows,
}) => {
  const t = useTranslations('common');
  const locale = useLocale();

  return (
    brandsData?.length > 0 && (
      <div className={cn('flex flex-col gap-2', containerClassName)}>
        <Text
          as="h2"
          className={cn('text-base text-grey-900 font-medium', titleClass)}
        >
          {t(title)}
        </Text>
        <MultilineCarousel
          items={brandsData}
          rows={rows || 2}
          threshold={isMobile ? 3 : 12}
          itemBasis="basis-[27.5%] lg:basis-[15.9%] xl:basis-[9.3%]"
          gridClassName={'grid-cols-6'}
          renderItem={(brand, index) => (
            <NextLink
              href={brand?.href}
              title={getLocaleString(brand, 'label', locale)}
              key={index}
            >
              <OptionCard
                label={getLocaleString(brand, 'label', locale)}
                src={brand?.logo}
              />
            </NextLink>
          )}
        />
      </div>
    )
  );
};
export default MantainenanceCenterBrands;
