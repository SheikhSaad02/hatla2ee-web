import { CardContent, CardFooter } from '@/components/ui/card';
import { appPaths } from '@/constants';
import { getLocaleStringServer, isMobileServer } from '@/utils/serverFunctions';
import { getTranslations } from 'next-intl/server';
import BaseCard from '../baseCard/baseCard';
import Button from '../button/button';
import NextLink from '../nextLink';
import ComparisonCarInfo from './comparisonCarInfo';
import ComparisonCarInfoGrid from './comparisonCarInfoGrid';

const ComparisonCard = async ({ listingsData, id, isFullWidth = false }) => {
  const t = await getTranslations('common');
  const isMobile = await isMobileServer();

  const listings = Object.values(listingsData);
  const processedData = await Promise.all(
    listings.map(async (listing) => ({
      make: await getLocaleStringServer(listing?.make, 'label'),
      model: await getLocaleStringServer(listing?.model, 'label'),
      variant: await getLocaleStringServer(listing?.variant, 'label'),
    })),
  );

  function getCompareText() {
    return (
      <span>
        {t('Compare')}
        {processedData.map((item, index) => (
          <span key={index}>
            <span className="mx-1 md:mx-3">{`${item.make} ${item.model}`}</span>
            {index < processedData.length - 1 && `${t('vs')}`}
          </span>
        ))}
      </span>
    );
  }

  return (
    listings &&
    listings.length > 1 && (
      <BaseCard
        className={`p-2 lg:p-5 gap-3 lg:gap-4 h-full group relative 
          bg-[linear-gradient(to_top,#F4F8FD_0%,white_100px)]
          hover:bg-[linear-gradient(to_top,#E8F1FC_0%,white_100px)]
          ${isFullWidth ? 'w-full' : ''}
        `}
        key={id}
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <NextLink
            href={`${appPaths.newCarCompareCar}/${id}`}
            className="font-semibold text-sm md:text-base lg:text-lg text-gray-800 hover:text-primary transition-colors p-2"
          >
            {getCompareText()}
          </NextLink>

          {/* Desktop button */}
          {!isMobile && (
            <Button
              variant="tertiary"
              size="sm"
              href={`${appPaths.newCarCompareCar}/${id}`}
            >
              {t('View Comparison')}
            </Button>
          )}
        </div>

        {/* Content */}
        <CardContent className="flex justify-center flex-1">
          {isMobile && listings.length > 2 ? (
            <ComparisonCarInfoGrid
              listings={listings}
              processedData={processedData}
            />
          ) : (
            <ComparisonCarInfo
              processedData={processedData}
              listings={listings}
              isMobile={isMobile}
            />
          )}
        </CardContent>

        {/* Mobile button in footer */}
        {isMobile && (
          <CardFooter className="flex justify-center py-4 px-2">
            <Button
              variant="tertiary"
              size="sm"
              href={`${appPaths.newCarCompareCar}/${id}`}
              className="min-w-60 border border-primary-500 py-4"
            >
              {t('View Comparison')}
            </Button>
          </CardFooter>
        )}
      </BaseCard>
    )
  );
};

export default ComparisonCard;
