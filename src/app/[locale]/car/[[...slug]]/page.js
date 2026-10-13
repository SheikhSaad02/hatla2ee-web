import PageLayout from '@/components/layout/pageLayout';
import UsedCarLanding from '@/components/usedCarLanding/usedCarLanding';
import {
  generateUsedCarListingsMetadata,
  UsedCarListingsListingLayout,
} from '@/components/listing/usedCarListings/usedCarListingsPageShared';
import { decodeSearchParams } from '@/utils/url';

export async function generateMetadata({ params, searchParams }) {
  const { slug: slugParts = [], locale } = await params;
  return generateUsedCarListingsMetadata(slugParts, locale, searchParams);
}

export default async function CarListingPage({ params, searchParams }) {
  const { slug: slugParts = [], locale } = await params;
  const queryParams = decodeSearchParams(await searchParams);

  if (slugParts.length === 0) {
    return (
      <PageLayout route="used-landing">
        <UsedCarLanding params={slugParts} queryParams={queryParams} />
      </PageLayout>
    );
  }

  return (
    <UsedCarListingsListingLayout
      slugParts={slugParts}
      locale={locale}
      queryParams={queryParams}
    />
  );
}
