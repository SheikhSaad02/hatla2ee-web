import { citiesForHome } from './landing';
import {
  newListingsFilterData,
  usedListingsFilterData,
} from './listings/filterData';
import {
  getUsedCarPriceRangesPriceTableFilter,
  getNewCarPriceRangesPriceTableFilter,
} from './carPrices/filterData';
const tenantData = {
  usedListingsFilterData,
  newListingsFilterData,
  citiesForHome,
  getUsedCarPriceRangesPriceTableFilter,
  getNewCarPriceRangesPriceTableFilter,
};

export default tenantData;
