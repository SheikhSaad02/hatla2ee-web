'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Illustrator } from '../common/illustrator/illustrator';
import ListingCard from '../listing/listingCard';
import { CarListingGridSkeleton } from '../common/loading';
import { getAsset, isLoggedIn } from '@/utils/general';
import { useFavorites } from '@/hooks/useFavorites';
import { useUser } from '@/providers/user';
import { useTranslations } from 'next-intl';
import NextImage from '../common/nextImage';
import Button from '../common/button/button';
import Pagination from '../common/pagination';
import {
  PAGE_TYPES,
  PAGE_SECTIONS,
} from '@/services/analyticsService/constants';
import { useIsMobile } from '@/providers/isMobile';

export const FavoriteCarsWrapper = ({ locale, isMobile: isMobileProp }) => {
  const t = useTranslations('common');
  const { user, loading: userLoading, showLoginModal } = useUser();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const { favoriteCars, isLoading, totalCount, totalPages, pageSize } = useFavorites(currentPage);
  const isMobileFromContext = useIsMobile();
  const isMob = isMobileProp ?? isMobileFromContext ?? false;
  const isUserLoggedIn = isLoggedIn(user);

  useEffect(() => {
    if (userLoading === false && !isUserLoggedIn) {
      showLoginModal();
    }
  }, [userLoading, isUserLoggedIn, showLoginModal]);

  if (userLoading) {
    return <CarListingGridSkeleton count={12} />;
  }

  if (!isUserLoggedIn) {
    return (
      <div className="flex items-center justify-center px-10 py-6 lg:py-10">
        <Illustrator
          image={
            <NextImage
              src={getAsset('/assets/favorite-car.png')}
              width={isMob ? 100 : 150}
              height={isMob ? 100 : 150}
            />
          }
          title={t('No Saved Ads Yet')}
          description={t('Log in to view your saved cars here')}
        >
          <Button onClick={showLoginModal} className="mt-4">
            {t('Login')}
          </Button>
        </Illustrator>
      </div>
    );
  }

  if (isLoading || userLoading) {
    return <CarListingGridSkeleton count={12} />;
  }

  if (totalCount === 0) {
    return (
      <div className="flex items-center justify-center px-10 py-6 lg:py-10">
        <Illustrator
          image={
            <NextImage
              src={getAsset('/assets/favorite-car.png')}
              width={isMob ? 100 : 150}
              height={isMob ? 100 : 150}
            />
          }
          title={t('No Saved Ads Yet')}
          description={t(
            'Browse cars, pick you favourites and save them for later',
          )}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favoriteCars?.map((item) => {
          const carPurposeTitle = t(
            `${item?.condition?.slug === 'new' ? `New` : `Used`} Car For Sale`,
          );

          return (
            <ListingCard
              key={`listing-${item?.listing_id}`}
              item={item}
              carPurposeTitle={carPurposeTitle}
              locale={locale}
              gaEvent="favorite_listing_click"
              pageType={PAGE_TYPES.FAVOURITES}
              pageSection={PAGE_SECTIONS.FAVORITES_LIST}
              source="favorites"
            />
          );
        })}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalCount={totalCount}
          pageSize={pageSize}
          totalPages={totalPages}
          useQuery={true}
        />
      )}
    </div>
  );
};
