import { ShowroomGridSkeleton } from '@/components/common/loading';
import PageLayout from '@/components/layout/pageLayout';
import ShowRoomListings from '@/components/showroom/showroom-listings-server';
import { isMobileServer } from '@/utils/serverFunctions';
import { getTranslations } from 'next-intl/server';
import { ConditionalSuspense as Suspense } from '@/components/common/ConditionalSuspense';
import { ShowroomSEOStrategy } from '@/services/seoStrategy/showroomPage';
import { decodeSearchParams } from '@/utils/url';
export async function generateMetadata({ params, searchParams }) {
  const { locale } = await params;
  const sp = decodeSearchParams(await searchParams);
  const page = sp?.page;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const showroomSEO = new ShowroomSEOStrategy({
    language: locale,
    page,
    absoluteTitle: true,
    titleKey: 'used',
  });
  const seoData = await showroomSEO.generateSEO();
  return {
    title: seoData.metaTitle,
    description: seoData.metaDescription || null,
    alternates: {
      canonical: seoData.canonical,
      languages: seoData.languages,
    },
  };
}

const ShowroomPage = async ({ searchParams, params }) => {
  const { page, location_id } = decodeSearchParams(await searchParams);
  const isMob = await isMobileServer();

  return (
    <PageLayout route="showroom">
      <Suspense fallback={<ShowroomGridSkeleton />}>
        <ShowRoomListings
          isMobile={isMob}
          page={page || 1}
          locationId={location_id || null}
          currentTab={'used'}
        />
      </Suspense>
    </PageLayout>
  );
};

export default ShowroomPage;
