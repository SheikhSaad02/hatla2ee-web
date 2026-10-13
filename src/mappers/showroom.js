import { getLocaleString } from '@/utils/general';

export function mapShowRoomsByAgencyData({ new: newData, used: usedData }) {
  const result = [];

  if (newData?.listingDetails?.length > 0) {
    result.push({
      label: 'New Cars',
      value: 'new',
      listings: newData?.listingDetails,
      pagination: newData?.pagination,
    });
  }

  if (usedData?.listingDetails?.length > 0) {
    result.push({
      label: 'Used Cars',
      value: 'used',
      listings: usedData.listingDetails,
      pagination: usedData.pagination,
    });
  }

  return result;
}
export function transformShowRoomMakes(data) {
  const transformedMakes = data?.map((bucket) => {
    const make = bucket.labels.hits.hits[0]._source.make;
    return {
      label: make?.label,
      label_l1: make?.label_l1,
      doc_count: bucket?.doc_count,
      slug: bucket?.key,
    };
  });
  return transformedMakes;
}

export function getShowroomListingsRequestPayload(
  activeValue,
  page,
  locationId,
) {
  return {
    ...((activeValue == 'used' || activeValue == 'new') && {
      'f[deals_in][]': `${activeValue}_car`,
    }),
    ...(activeValue == 'ev' && { 'f[vehicle_type]': 'ev' }),
    'f[authorized]': activeValue == 'authorized',
    page: page,
    'f[location_id]': locationId,
    per_page: 30,
    'sort[featured]': 'desc',
    'sort[listing_count]': 'desc',
  };
}

// Agencies from `fetchDealersData` (apis/dealers) shaped for the showroom
// cards on the buy-credits page. Locale is resolved here so the shaping stays
// on the server and only rendered fields cross into the client bundle.
export function mapAgenciesToShowrooms(agencies, locale) {
  if (!Array.isArray(agencies)) return [];

  return agencies.map((agency) => ({
    id: agency.id,
    name: getLocaleString(agency, 'name', locale),
    location: getLocaleString(agency.location, 'name', locale),
    logo: agency.agency_logo || null,
    carCount: agency.listing_count,
    featured: agency.featured,
    quote: agency.testimonial?.[locale] || null,
    slug: agency.slug,
  }));
}
