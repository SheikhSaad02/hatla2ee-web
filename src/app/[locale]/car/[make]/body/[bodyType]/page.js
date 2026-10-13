import {
  generateUsedCarListingsMetadata,
  UsedCarListingsListingLayout,
} from '@/components/listing/usedCarListings/usedCarListingsPageShared';
import { decodeSearchParams } from '@/utils/url';
export async function generateMetadata({ params, searchParams }) {
  const { make, bodyType, locale } = await params;
  const slugParts = [make, 'body', bodyType];
  return generateUsedCarListingsMetadata(slugParts, locale, searchParams);
}

export default async function CarMakeBodyTypeListingsPage({
  params,
  searchParams,
}) {
  const queryParams = decodeSearchParams(await searchParams);
  const { make, bodyType, locale } = await params;
  const slugParts = [make, 'body', bodyType];
  return (
    <UsedCarListingsListingLayout
      slugParts={slugParts}
      locale={locale}
      queryParams={queryParams}
    />
  );
}
