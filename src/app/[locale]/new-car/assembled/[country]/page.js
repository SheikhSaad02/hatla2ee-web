import { newVehiclesCategorySlugs } from '@/constants';
import AssembledPageWrapper from '@/components/listing/newVehicleListings/assembledPageWrapper';
import { generateAssembledMetadata } from '@/utils/new-cars/listings';

const categorySlug = newVehiclesCategorySlugs.newCars;

export async function generateMetadata({ params, searchParams }) {
  return await generateAssembledMetadata(params, searchParams, categorySlug);
}

const page = async ({ params, searchParams }) => {
  return (
    <AssembledPageWrapper
      categorySlug={categorySlug}
      params={params}
      searchParams={searchParams}
    />
  );
};

export default page;
