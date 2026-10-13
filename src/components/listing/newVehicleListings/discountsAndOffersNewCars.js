import { fetchDiscountsAndOffersNewVehicles } from '@/apis/new-cars-listings';
import NewVehicleCard from '@/components/common/newVehicleCard/newVehicleCard';
import SectionCarousel from '@/components/common/sectionCarousel';
import { getNewCarsListingSectionProps } from '@/utils/new-cars/listings';
import { getLocale, getTranslations } from 'next-intl/server';
import React from 'react';

const DiscountsAndOffersNewCars = async () => {
  const data = await fetchDiscountsAndOffersNewVehicles();
  const t = await getTranslations('common');
  const locale = await getLocale();
  return (
    <SectionCarousel
      title={t('New Discounts and Offers')}
      data={data}
      component={NewVehicleCard}
      getItemProps={(item, index) =>
        getNewCarsListingSectionProps(item, index, locale)
      }
    />
  );
};

export default DiscountsAndOffersNewCars;
