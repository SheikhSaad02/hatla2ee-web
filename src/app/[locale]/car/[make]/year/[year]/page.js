import {
  generateUsedCarListingsMetadata,
  UsedCarListingsListingLayout,
} from '@/components/listing/usedCarListings/usedCarListingsPageShared';
import { decodeSearchParams } from '@/utils/url';
export async function generateMetadata({ params, searchParams }) {
  const { make, year, locale } = await params;
  const slugParts = [make, 'year', year];
  return generateUsedCarListingsMetadata(slugParts, locale, searchParams);
}

export default async function CarMakeYearListingsPage({
  params,
  searchParams,
}) {
  const queryParams = decodeSearchParams(await searchParams);
  const { make, year, locale } = await params;
  const slugParts = [make, 'year', year];
  return (
    <UsedCarListingsListingLayout
      slugParts={slugParts}
      locale={locale}
      queryParams={queryParams}
    />
  );
}
