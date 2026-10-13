import { mapReviewDetail } from '@/mappers/reviews';
import { apiClient } from '@/services/network/api-client';
import { transformImages } from '@/utils/general';
import { convertQueryObjToString } from '@/utils/url';
import { IMAGES_BASE_URL } from '@/constants';
import configs from '@/configs';
export async function getReviews(params) {
  const res = await apiClient.get(
    `/api/surge/consumer/reviews?${convertQueryObjToString(params)}`,
  );

  return res?.error
    ? res
    : {
        ...res,
        reviews: res?.reviews?.map((review) => ({
          ...review,
          images: transformImages(review?.images),
          label: `${review?.make?.label} ${review?.model?.label} ${review?.year_from} - ${review?.year_to}`,
          rating: review?.ratings,
          label_l1: `${review?.make?.label_l1} ${review?.model?.label_l1} ${review?.year_from} - ${review?.year_to}`,
          yearRange: `${review?.year_from} - ${review?.year_to}`,
          href: `/review/${review?.make?.slug}/${review?.model?.slug}/${review?.id}`,
        })),
      };
}

export async function getReviewDetail(id) {
  const res = await apiClient.get(`/api/surge/consumer/reviews/${id}`);
  const result = mapReviewDetail(res?.review);

  return res?.error ? res : result;
}

export async function fetchReviewsByMake() {
  const res = await apiClient.get(`/api/surge/consumer/reviews/by_make`);

  const makes = res?.makes?.map((make) => ({
    ...make,
    doc_count: make?.reviews_count,
    image: make?.logo,
    href: `/review/${make?.slug}`,
    ...(!configs.USE_BRAND_SPRITE && {
      src: `${IMAGES_BASE_URL}/${make?.slug}/thumbnail.png`,
    }),
  }));

  return res?.error ? res : makes;
}
