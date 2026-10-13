import { getMaintenanceCenterCities } from '@/apis/maintenance-cities';
import { getLocale, getTranslations } from 'next-intl/server';
import { MultilineCarousel } from '../common/carousel/multlineCarousel';
import { ChipWithIcon } from '../common/chip-with-icon/chip-with-icon';
import { getLocaleString } from '@/utils/general';
import Text from '../common/text';
import { isMobileServer } from '@/utils/serverFunctions';

const MaintenanceCenterCities = async ({
  locationSlug,
  makeSlug,
  suffixPath,
}) => {
  const isMobile = await isMobileServer();

  const params = {
    ...(locationSlug && {
      'f[location_slug]': decodeURIComponent(locationSlug),
    }),
    ...(makeSlug && { 'f[make_slug]': makeSlug }),
  };

  const paramsLength = Object.keys(params)?.length;

  const citiesData = await getMaintenanceCenterCities(
    paramsLength > 0 ? params : null,
    suffixPath,
  );
  const t = await getTranslations('common');
  const locale = await getLocale();

  return (
    citiesData?.length > 0 && (
      <div className="flex flex-col gap-2">
        <Text as="h2" className="text-base text-grey-900 font-medium">
          {t('Cities')}
        </Text>

        <MultilineCarousel
          items={citiesData}
          rows={2}
          threshold={isMobile ? 4 : 7}
          itemBasis="basis-[45%] md:basis-[27%] lg:basis-[16.66%]"
          gridClassName={isMobile && 'grid-cols-2'}
          renderItem={(city, index) => (
            <ChipWithIcon
              key={index}
              href={city?.href}
              hrefTitle={getLocaleString(city, 'label', locale)}
              label={
                <>
                  {getLocaleString(city, 'label', locale)}
                  {city?.count > 0 && (
                    <span className="text-xs text-dim ms-1">
                      ({city?.count})
                    </span>
                  )}
                </>
              }
              className="justify-center capitalize"
            />
          )}
        />
      </div>
    )
  );
};
export default MaintenanceCenterCities;
