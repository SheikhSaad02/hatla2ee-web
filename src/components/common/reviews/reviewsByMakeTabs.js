import { fetchReviewsByMake } from '@/apis/reviews';
import { getTranslations } from 'next-intl/server';
import React from 'react';
import { MultilineCarousel } from '../carousel/multlineCarousel';
import { isMobileServer } from '@/utils/serverFunctions';

const ReviewsByMakeTabs = async ({ locale }) => {
  const makes = await fetchReviewsByMake();
  const t = await getTranslations('reviews');
  const isMob = await isMobileServer();

  if (!makes?.length) return;

  return (
    <div>
      <h2 className="sectionHeading">{t('Browse by Brands')}</h2>
      <MultilineCarousel
        items={makes}
        rows={2}
        locale={locale}
        threshold={isMob ? 9 : 20}
        type={'optionCard'}
        contentClassName="flex-row gap-1.5 text-sm"
        subLabelClassName="lg:text-xs"
        itemBasis="basis-[33%] md:basis-[19.5%] lg:basis-[15%] xl:basis-[11%]"
      />
    </div>
  );
};

export default ReviewsByMakeTabs;
