import { fetchListingDetail } from '@/apis/listing';
import { generateListingDetailUrl } from '@/utils/url';
import { permanentRedirect, notFound } from 'next/navigation';

const AdListingPage = async ({ params }) => {
  const { id, locale } = await params;

  const listing = await fetchListingDetail(id);

  if (!listing || listing?.error) notFound();

  const urlData = { ...listing, ...(listing.dynamic_fields || {}) };

  permanentRedirect(`/${locale}${generateListingDetailUrl(urlData)}`);
};

export default AdListingPage;
