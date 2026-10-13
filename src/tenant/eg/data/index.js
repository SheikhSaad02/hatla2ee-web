import { citiesForHome } from './landing';
import {
  newListingsFilterData,
  usedListingsFilterData,
} from './listings/filterData';
import {
  getUsedCarPriceRangesPriceTableFilter,
  getNewCarPriceRangesPriceTableFilter,
} from './carPrices/filterData';
import { cityOptionsForFinance } from './carFinance';

const tenantData = {
  usedListingsFilterData,
  newListingsFilterData,
  citiesForHome,
  getUsedCarPriceRangesPriceTableFilter,
  getNewCarPriceRangesPriceTableFilter,
  cityOptionsForFinance,
};

export default tenantData;
