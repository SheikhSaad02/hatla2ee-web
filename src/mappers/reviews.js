import { convertToEmbedLinks, transformImages } from '@/utils/general';
import { IMAGES_BASE_URL } from '@/constants';
import configs from '@/configs';
export function mapReviewDetail(review) {
  if (review) {
    return {
      ...review,
      label: review?.title,
      label_l1: review?.title_l1,
      rating: review.rating,
      images: transformImages(review?.images),
      videoReviews: convertToEmbedLinks(review?.review_video),
      logo: review?.make?.logo,
      ...(!configs.USE_BRAND_SPRITE && {
        src: `${IMAGES_BASE_URL}/${review?.make?.slug}/thumbnail.png`,
      }),
      categories: [
        {
          label: 'Motor',
          description: review?.motor_desc,
          description_l1: review?.motor_desc_l1,
          value: review.motor_rate,
        },
        {
          label: 'Salon',
          value: review.salon_rate,
          description: review?.salon_desc,
          description_l1: review?.salon_desc_l1,
        },
        {
          label: 'Spare Parts',
          value: review.spare_part_rate,
          description: review?.spare_part_desc,
          description_l1: review?.spare_part_desc_l1,
        },
        {
          label: 'Suspension',
          value: review.suspension_rate,
          description: review?.suspension_desc,
          description_l1: review?.suspension_desc_l1,
        },
        {
          label: 'Resale',
          value: review.resale_rate,
          description: review?.resale_desc,
          description_l1: review?.resale_desc_l1,
        },
        {
          label: 'Security',
          value: review.security_rate,
          description: review?.security_desc,
          description_l1: review?.security_desc_l1,
        },
        {
          label: 'Equipment',
          value: review.equipment_rate,
          description: review?.equipment_desc,
          description_l1: review?.equipment_desc_l1,
        },
      ].filter((category) => category.value != null),
    };
  }
}
