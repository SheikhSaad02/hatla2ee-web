'use client';
import Button from '@/components/common/button/button';
import React from 'react';
import { useTranslations } from 'next-intl';
import { appPaths } from '@/constants';
import { cn } from '@/utils';
import CarSelection from '../carSelection/carSelection';
import { getPagesHrefsForCategorySlug } from '@/utils/new-cars/listings';
import { buildNewVehicleListingUrl } from '@/services/urlBuilder/newCarListingUrl';
import { useRouter } from '@/i18n/navigation';
import { useSearchAnalytics } from '@/hooks/useSearchAnalytics';

const NewCarLandingSearch = ({ isMobile, categorySlug }) => {
  const { push } = useRouter();
  const t = useTranslations('home');
  const getBrowseAllHref = getPagesHrefsForCategorySlug(categorySlug);
  const handleSearchOpen = useSearchAnalytics('new_car_landing');

  const onSelectHandler = ({ brand, model }) => {
    if (brand && !model) {
      push(
        `${getPagesHrefsForCategorySlug(categorySlug, 'landing')}/${
          brand.slug
        }`,
      );
    } else {
      push(buildNewVehicleListingUrl({ make: brand, model }, categorySlug));
    }
  };

  return (
    <div className="flex flex-col  gap-2.5  md:gap-4 md:w-full">
      <CarSelection
        isMobile={isMobile}
        // elasticSearch={true}
        containerClassName="w-full"
        className=" rounded-md lg:rounded-lg"
        onSelect={onSelectHandler}
        onOpen={handleSearchOpen}
        categorySlug={categorySlug}
        brandInitialArgs={categorySlug}
        modelInitialArgs={categorySlug}
        steps={['brand', 'model']}
        size={isMobile ? 'small' : 'large'}
      />

      <Button
        href={getBrowseAllHref}
        variant={'secondary'}
        className={cn('bannerBtn')}
      >
        {t('Browse All')}
      </Button>
    </div>
  );
};

export default NewCarLandingSearch;
