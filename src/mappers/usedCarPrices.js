import { appPaths } from '@/constants';
import { formatMonthYear } from '@/utils/date';

const usedCarPricingDataMapper = (apiData = [], make, model) => {
  return {
    data: apiData?.map((item, index) => ({
      id: item.id || index,
      title: {
        href: `${appPaths['usedCarPrices']}/${item?.make?.slug}/${item?.model?.slug}/${item?.year}`,
        text: `${item?.make?.label} ${item?.model?.label} ${item?.year}`,
        text_l1: `${item?.make?.label_l1} ${item?.model?.label_l1} ${item?.year}`,
      },
      avgPrice: item.avg_price,
      minPrice: item.min_price,
      maxPrice: item.max_price,
      year: item.year,
    })),
    meta: {
      ...(make && { make: apiData?.[0]?.make || null }),
      ...(model && { model: apiData?.[0]?.model || null }),
    },
  };
};
const usedCarPricingDetailDataMapper = (apiData = [], locale) => {
  return {
    data: apiData?.map((item, index) => ({
      id: item.id || index,
      monthYear: formatMonthYear(item.month, locale),
      avgPrice: item.avg_price,
      minPrice: item.min_price,
      maxPrice: item.max_price,
    })),
    meta: {
      make: apiData?.[0]?.make || null,
      model: apiData?.[0]?.model || null,
      latestUpdatedOn: apiData?.[0]?.month || null,
    },
  };
};
const carEvaluationMapper = (data) => {
  if (!Object.keys(data).length) return;
  return {
    ...data,
    image: data?.make?.logo,
  };
};

export {
  usedCarPricingDataMapper,
  usedCarPricingDetailDataMapper,
  carEvaluationMapper,
};
