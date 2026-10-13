import React from 'react';
import NextImage from '../nextImage';
import { getAsset } from '@/utils/general';
import { useTranslations } from 'next-intl';
import { Illustrator } from '../illustrator/illustrator';
import { cn } from '@/utils';

const ListingNotFound = (props) => {
  const t = useTranslations('common');

  const {
    title = t('No Ads Found'),
    description = t('Please try adjusting your filters or search criteria'),
    isMobile,
    className,
  } = props;

  return (
    <div
      className={cn(
        'flex items-center justify-center px-10 py-6 lg:py-10',
        className,
      )}
    >
      <Illustrator
        image={
          <NextImage
            src={getAsset('/assets/noData.svg')}
            alt="No Ads Found"
            width={isMobile ? 100 : 150}
            height={isMobile ? 100 : 150}
          />
        }
        title={title}
        description={description}
      />
    </div>
  );
};

export default ListingNotFound;
