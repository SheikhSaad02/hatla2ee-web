import PageLayout from '@/components/layout/pageLayout';
import NewVehicleListings from '@/components/listing/newVehicleListings/newVehicleListings';
import NewVehicleListingsWrapper from '@/components/listing/newVehicleListings/newVehicleListingsWrapper';
import { newVehiclesCategorySlugs } from '@/constants';
import { newVehicleUrlValidator } from '@/services/urlValidator/newVehicleListings';
import {
  getNewVehiclesSearchMetaData,
  parseUrlSearchParams,
} from '@/utils/new-cars/listings';

const categorySlug = newVehiclesCategorySlugs.newTrucks;

export async function generateMetadata({ params, searchParams }) {
  const { h1, ...metaData } = await getNewVehiclesSearchMetaData({
    params,
    searchParams,
    categorySlug,
  });

  return metaData;
}

const page = async ({ params, searchParams }) => {
  return (
    <NewVehicleListingsWrapper
      params={params}
      searchParams={searchParams}
      categorySlug={categorySlug}
    />
  );
};

export default page;
