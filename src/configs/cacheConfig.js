export const apiInvalidationTags = {
  allLocations: 'fetchAllLocations',
  allMakes: 'fetchAllMakes',
  allData: 'allData',
  topLocationsByCount: 'topLocationsByCount',
};

export const apiCacheConfig = {
  carNews: { revalidate: 86400, tags: [apiInvalidationTags.allData] },
  ccRanges: {
    revalidate: 180,
    tags: [apiInvalidationTags.allData],
  },
  fuelTypes: {
    revalidate: 180,
    tags: [apiInvalidationTags.allData],
  },
  bodyTypes: {
    revalidate: 180,
    tags: [apiInvalidationTags.allData],
  },
  allLocations: {
    revalidate: 300,
    tags: [apiInvalidationTags.allLocations, apiInvalidationTags.allData],
  },
  topMakes: {
    revalidate: 180,
    tags: [apiInvalidationTags.allData],
  },
  allMakes: {
    revalidate: 300,
    tags: [apiInvalidationTags.allMakes, apiInvalidationTags.allData],
  },
  topModels: { revalidate: 180, tags: [apiInvalidationTags.allData] },
  topLocationsByCount: {
    revalidate: 180,
    tags: [
      apiInvalidationTags.topLocationsByCount,
      apiInvalidationTags.allData,
    ],
  },
  colors: {
    revalidate: 600,
    tags: [apiInvalidationTags.allData],
  },
  creditPackages: {
    revalidate: 3600,
    tags: [apiInvalidationTags.allData],
  },
  agencies: {
    revalidate: 3600,
    tags: [apiInvalidationTags.allData],
  },
  usedCarsListings: { cache: 'no-store' },
};
