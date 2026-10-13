import { MultilineCarousel } from '@/components/common/carousel/multlineCarousel';
import { ChipWithIcon } from '@/components/common/chip-with-icon/chip-with-icon';
import Text from '@/components/common/text';
import { ListingsService } from '@/services/elasticsearch/listings-service';
import { getLocaleStringServer, isMobileServer } from '@/utils/serverFunctions';
import { getTranslations } from 'next-intl/server';

const RelatedModels = async ({ modelSlug, locale }) => {
  const t = await getTranslations('common');
  const isMob = isMobileServer();

  if (!modelSlug) {
    return null;
  }

  const { years } = await ListingsService.getYearWiseModelCount(modelSlug);

  if (!years?.length) {
    return null;
  }

  return (
    <div>
      <Text as="h2" className="sectionHeading">
        {t('Related Models')}
      </Text>
      <MultilineCarousel
        showArrows
        items={years}
        rows={3}
        locale={locale}
        threshold={isMob ? 6 : 21}
        type={'optionCard'}
        itemBasis="basis-[60%] md:basis-[25%] lg:basis-[21%] xl:basis-[18.5%]"
        gridClassName={isMob ? 'grid-cols-2' : 'grid-cols-7'}
        renderItem={async (year, index) => (
          <ChipWithIcon
            key={index}
            href={year?.href}
            hrefTitle={t('Used {make} For Sale', {
              make: await getLocaleStringServer(year, 'label'),
            })}
            label={await getLocaleStringServer(year, 'label')}
            className="justify-center capitalize"
          />
        )}
      />
    </div>
  );
};

export default RelatedModels;
