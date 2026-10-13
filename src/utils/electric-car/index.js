import { buildNewVehicleListingUrl } from '@/services/urlBuilder/newCarListingUrl';
import { newVehiclesCategorySlugs } from '@/constants';
import { filterKeys } from '@/filters/new-cars/filterConfig';
import {
  BATTERY_CAPACITY_OPTIONS,
  KM_RANGE_TAB_BUCKETS,
  EV_NEW_CAR_FUEL_SLUGS,
} from '@/components/evLanding/data';

const NEW_CAR_CATEGORY = newVehiclesCategorySlugs.newCars;

export const newElectricCarsSearchLink = buildNewVehicleListingUrl(
  { [filterKeys.fuel]: EV_NEW_CAR_FUEL_SLUGS },
  NEW_CAR_CATEGORY,
);

export const batteryCapacityTabItems = BATTERY_CAPACITY_OPTIONS.map(
  (option) => ({
    ...option,
    link: buildNewVehicleListingUrl(
      {
        [filterKeys.batteryCapacity]: { slug: option.slug },
        [filterKeys.fuel]: EV_NEW_CAR_FUEL_SLUGS,
      },
      NEW_CAR_CATEGORY,
    ),
  }),
);

export const kmRangeTabItems = KM_RANGE_TAB_BUCKETS.map((bucket) => ({
  ...bucket,
  link: buildNewVehicleListingUrl(
    {
      [filterKeys.kmRange]:
        bucket.op === 'gt' ? { min: bucket.value } : { max: bucket.value },
      [filterKeys.fuel]: EV_NEW_CAR_FUEL_SLUGS,
    },
    NEW_CAR_CATEGORY,
  ),
}));
