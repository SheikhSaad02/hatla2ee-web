import configs from '@/configs';
import { ListingsService } from '@/services/elasticsearch/listings-service';
import filterData from '@data';

export async function fetchUsedCarsListingsData({
  updatedFilters = {},
  page = 1,
  pageSize = 40,
  type,
} = {}) {
  try {
    const res = await ListingsService.getUsedCarsListings({
      filters: updatedFilters,
      page,
      pageSize,
      type,
    });

    return { data: res.items, totalCount: res.totalCount };
  } catch (err) {
    console.error('Error loading listings:', err);
    return { data: [], totalCount: 0 };
  }
}

export const fetchUsedCarsListingsCount = async (updatedFilters) => {
  const res = await ListingsService.getUsedCarsListingsCount({
    filters: updatedFilters,
  });
  return res;
};

export const fetchSlottedListings = async (updatedFilters) => {
  const { sortby, page = 1 } = updatedFilters || {};
  const hasCustomSort =
    sortby?.slug && sortby.slug !== filterData.DEFAULT_SORT.slug;

  const { pageSize, premiumSlots, turboSlots, basicSlots } =
    configs.slotting.usedCars;

  if (hasCustomSort) {
    const response = await fetchUsedCarsListingsData({
      page,
      pageSize,
      updatedFilters,
    });
    return {
      results: response.data || [],
      totalCount: response.totalCount || 0,
      totalPages: Math.ceil((response.totalCount || 0) / pageSize),
    };
  }

  const [premiumRes, turboRes, simpleRes] = await Promise.all([
    fetchUsedCarsListingsData({
      page,
      pageSize: premiumSlots,
      type: 'premium',
      updatedFilters,
    }),
    fetchUsedCarsListingsData({
      page,
      pageSize: turboSlots,
      type: 'turbo',
      updatedFilters,
    }),
    fetchUsedCarsListingsData({
      page,
      pageSize: basicSlots,
      type: 'simple',
      updatedFilters,
    }),
  ]);

  const results = [
    ...(turboRes.data || []),
    ...(premiumRes.data || []),
    ...(simpleRes.data || []),
  ];
  const turboPages = Math.ceil((turboRes.totalCount || 0) / turboSlots);
  const premiumPages = Math.ceil((premiumRes.totalCount || 0) / premiumSlots);
  const simplePages = Math.ceil((simpleRes.totalCount || 0) / basicSlots);

  return {
    results,
    totalCount:
      (premiumRes.totalCount || 0) +
      (turboRes.totalCount || 0) +
      (simpleRes.totalCount || 0),
    totalPages: Math.max(premiumPages, turboPages, simplePages),
  };
};
