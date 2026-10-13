import { fetchTopSearchedNewVehicles } from '@/apis/new-cars-listings';
import NewVehicleCard from '@/components/common/newVehicleCard/newVehicleCard';
import SectionCarousel from '@/components/common/sectionCarousel';
import { appPaths } from '@/constants';
import { getNewCarsListingSectionProps } from '@/utils/new-cars/listings';
import { getLocale, getTranslations } from 'next-intl/server';
import React from 'react';
import { PAGE_TYPES, PAGE_SECTIONS } from '@/services/analyticsService/constants';

const TopSearchedNewCars = async () => {
  const data = await fetchTopSearchedNewVehicles();
  const t = await getTranslations('common');
  const locale = await getLocale();
  return (
    <SectionCarousel
      title={t('Top Searched New Cars')}
      viewAllHref={appPaths.newCarsListingsSearch}
      viewAllLabel={t('View All New Cars')}
      data={data}
      component={NewVehicleCard}
      getItemProps={(item, index) =>
        getNewCarsListingSectionProps(item, index, locale)
      }
      gaEvent="view_all_link_click"
      pageType={PAGE_TYPES.NEW_CAR_LANDING}
      pageSection={PAGE_SECTIONS.NEWLY_LAUNCHED_CARS}
    />
  );
};

export default TopSearchedNewCars;
