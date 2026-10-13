import { apiClient } from '@/services/network/api-client';
import { convertQueryObjToString } from '@/utils/general';

const mapShowroomDetailResponse = (response) => {
  const socialIconPaths = {
    facebook: 'faceBookIcon',
    instagram: 'instagramIcon',
    twitter: 'twitterIcon',
    youtube: 'youtubeIcon',
  };
  const socialLinks = response?.social_links
    ? Object.entries(response?.social_links)
      .filter(([key, value]) => key in socialIconPaths && !!value)
      .map(([key, value]) => ({
        platform: key,
        link: value,
        icon: socialIconPaths[key],
      }))
    : [];
  return { ...response, socialLinks };
};

const mapShowroomListingsResponse = (response) => {
  const agencies = response?.agencies?.map((agency) => {
    const title = agency?.name;
    const title_l1 = agency?.name_l1;
    const image = { src: agency?.agency_logo };
    const phone = agency?.mobile;
    const addresses =
      agency?.addresses?.map((addr) => ({
        location: addr?.location?.name,
        location_l1: addr?.location?.name_l1,
      })) || [];

    return {
      href: `/showroom/${agency?.slug}`,
      title,
      image,
      phone: { call: phone },
      title_l1,
      addresses,
      featured: agency?.featured,
      is_vip_featured: agency?.is_vip_featured,
    };
  });

  return {
    ...response,
    agencies,
  };
};

export async function fetchShowroomListings(showroomSlug, params) {
  const res = await apiClient.get(
    `/api/surge/consumer/agencies/detail??slug=${showroomSlug}${convertQueryObjToString(
      params,
    )}`,
  );
  const transformedData = mapShowroomListingsResponse(res);

  return transformedData;
}

export async function fetchAllShowroom(params, showRoomBasePath, showRoomType) {
  const res = await apiClient.get(
    `/api/surge/consumer/agencies${convertQueryObjToString(params)}${(showRoomType == 'new' || showRoomType == 'used') ? `&f[deals_in][]=both` : ''
    }`,
  );
  const transformedData = mapShowroomListingsResponse(res, showRoomBasePath);

  return transformedData;
}

export async function fetchShowroomDetail(showroomSlug) {
  const res = await apiClient.get(
    `/api/surge/consumer/agencies/detail?slug=${showroomSlug}`,
  );
  const transformedData = mapShowroomDetailResponse(res?.agency);

  return transformedData;
}
