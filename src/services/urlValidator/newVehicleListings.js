import { fetchListingsByMake } from '@/apis/new-car';
import { getNewVehiclesFiltersData } from '@/apis/new-cars-listings';
import { appPaths } from '@/constants';
import {
  getPagesHrefsForCategorySlug,
  getShouldfetchVariantLevelAds,
} from '@/utils/new-cars/listings';
import { notFound, redirect } from 'next/navigation';
import { MakesService } from '../elasticsearch/makes-service';

export class NewVehicleListingUrlValidatorService {
  async validateUrl(queryParams = {}, categorySlug, isSearch, locale) {
    const filters = await getNewVehiclesFiltersData(
      queryParams,
      categorySlug,
      getShouldfetchVariantLevelAds(isSearch, queryParams),
    );
    if (isSearch) return { filters };

    const { make, body } = filters;

    // //now check if make and !listingDetailData then redirect to used car make page
    if (queryParams?.make && !make) {
      const listingsByMake = await fetchListingsByMake(
        queryParams?.make,
        categorySlug,
      );

      const allMakes = await MakesService.getAllMakes();
      if (allMakes.error) return { exists: false };

      const makeSlugs = allMakes.map((make) => make.slug);
      const exists = makeSlugs.includes(queryParams?.make);

      if (exists && listingsByMake) {
        redirect(`/${locale}${appPaths.usedCars}/${queryParams?.make}`);
      } else if (!exists) {
        notFound();
      }
    }

    if (queryParams.body) {
      if (!body)
        redirect(
          `/${locale}/${getPagesHrefsForCategorySlug(categorySlug, 'landing')}`,
        );
    }

    return { filters };
  }
}

export const newVehicleUrlValidator =
  new NewVehicleListingUrlValidatorService();
