import { apiClient } from '@/services/network/api-client';
const cityBasedShowroomsMapper = (data) => {
  const showRoomsData = data
    ?.filter((e) => !!e.showroom.length)
    ?.map((item) => {
      return {
        city_title: item?.title,
        city_title_l1: item?.title_l1,
        showRooms: item?.showroom?.map((showroom) => ({
          ...showroom,
          title: showroom?.name,
          title_l1: showroom?.name_l1,
        })),
      };
    });

  return showRoomsData;
};
export async function fetchCityWiseShowrooms(make) {
  const response = await apiClient.get(
    `/api/surge/consumer/outlets?f[make_slug]=${make}`,
  );

  return cityBasedShowroomsMapper(response?.outlets);
}

const cityBasedDealersMapper = (data) => {
  const dealersData = data
    ?.filter((e) => !!e.dealer.length)
    ?.map((item) => {
      return {
        city_title: item?.title,
        city_title_l1: item?.title_l1,
        dealers: item?.dealer?.map((dealer) => ({
          ...dealer,
          title: dealer?.name,
          title_l1: dealer?.name_l1,
        })),
      };
    });

  return dealersData;
};

export async function fetchCityWiseDealers(make) {
  const response = await apiClient.get(
    `/api/surge/consumer/outlets?f[make_slug]=${make}`,
  );

  return cityBasedDealersMapper(response?.outlets);
}