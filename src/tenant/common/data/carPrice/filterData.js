import tenantData from '@tenantData';

const getUsedCarPriceRangesPriceTableFilter =
  tenantData.getUsedCarPriceRangesPriceTableFilter;

const getNewCarPriceRangesPriceTableFilter =
  tenantData.getNewCarPriceRangesPriceTableFilter;

const commonPriceFilterData = {
  getNewCarPriceRangesPriceTableFilter,
  getUsedCarPriceRangesPriceTableFilter,
};

export default commonPriceFilterData;
