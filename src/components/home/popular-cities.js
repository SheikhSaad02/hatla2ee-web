import { appPaths } from '@/constants';
import { getLocaleString } from '@/utils/general';
import { ChevronRightIcon } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';
import { MultilineCarousel } from '../common/carousel/multlineCarousel';
import { ChipWithIcon } from '../common/chip-with-icon/chip-with-icon';
import LinkWithIcon from '../common/linkWithIcon/linkWithIcon';
import { buildUsedCarListingUrl } from '@/services/urlBuilder/usedCarListingUrl';
import { LocationsService } from '@/services/elasticsearch/location-service';
import tenantData from '@data';

const PopularCities = async ({
  citiesCount,
  showAllCities = false,
  scopeFilters,
}) => {
  let cityIdBySlug = {};
  if (scopeFilters) {
    const locations = await LocationsService.fetchAllLocations();
    cityIdBySlug = Object.fromEntries(
      (locations || []).map((loc) => [loc.slug, loc.id]),
    );
  }

  const cityHref = (slug) =>
    scopeFilters
      ? buildUsedCarListingUrl({
          city: { id: cityIdBySlug[slug], slug },
          ...scopeFilters,
        })
      : `${appPaths.cityPath}/${slug}`;
  const t = await getTranslations('home');
  const locale = await getLocale();
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="sectionHeading">{t('Browse By City or District')}</h2>
        {showAllCities && (
          <LinkWithIcon
            icon={
              <ChevronRightIcon className="w-4 h-4 bg-primary-50 text-primary rounded-xs rtl:rotate-180 self-center" />
            }
            iconPosition={'right'}
            href={appPaths.cities}
            title={t('View All Cities')}
            className="text-primary justify-evenly text-xs md:text-sm  hover:text-primary lg:font-bold gap-1"
          />
        )}
      </div>
      <MultilineCarousel
        items={
          tenantData.citiesForHome?.length > citiesCount
            ? tenantData.citiesForHome.slice(0, citiesCount)
            : tenantData.citiesForHome
        }
        width="200"
        rows={3}
        itemBasis="basis-[60%] md:basis-[25%] lg:basis-[21%] xl:basis-[18.5%]"
        showArrows
        renderItem={(city, index) => (
          <ChipWithIcon
            key={index}
            href={cityHref(city?.slug)}
            hrefTitle={t('Used car for sale {cityTitle}', {
              cityTitle: getLocaleString(city, 'title', locale),
            })}
            label={getLocaleString(city, 'title', locale)}
            className="justify-center capitalize"
            optionClickGaEvent="browse_city_district_click"
            optionText={city?.label}
          />
        )}
      />
    </div>
  );
};
export default PopularCities;
