import landingData from './landing';
import commonFilterData from './listings/filterData';
import commonPriceFilterData from './carPrice/filterData';
import carFinanceData from './carFinance';

const data = {
  ...commonFilterData,
  ...landingData,
  ...commonPriceFilterData,
  ...carFinanceData,
};

export default data;
