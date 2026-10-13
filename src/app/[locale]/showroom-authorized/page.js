import PageLayout from '@/components/layout/pageLayout';
import ShowRoomListings from '@/components/showroom/showroom-listings-server';
import { isMobileServer } from '@/utils/serverFunctions';
import { getTranslations } from 'next-intl/server';
import { ConditionalSuspense as Suspense } from '@/components/common/ConditionalSuspense';
import { ShowroomSEOStrategy } from '@/services/seoStrategy/showroomPage';
import { ShowroomGridSkeleton } from '@/components/common/loading';
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
    titleKey: 'authorized',
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

export default async function AuthorizedCarShowRoomPage({ searchParams }) {
  const params = decodeSearchParams(await searchParams);
  const isMob = await isMobileServer();

  return (
    <PageLayout route="showroom" className="pt-2">
      <Suspense fallback={<ShowroomGridSkeleton />}>
        <ShowRoomListings
          isMobile={isMob}
          page={params?.page || 1}
          locationId={params?.location_id || null}
          currentTab={'authorized'}
        />
      </Suspense>
    </PageLayout>
  );
}
