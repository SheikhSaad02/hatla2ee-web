import { getLocaleString } from '@/utils/general';
import { ChevronRightIcon, Star } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';
import BaseCard from '../baseCard/baseCard';
import LinkWithIcon from '../linkWithIcon/linkWithIcon';
import Progress from '../progress/progress';
import Text from '../text';
import { fetchReviews } from '@/apis/listing';

export default async function Reviews({
  makeSlug,
  modelSlug,
  year,
  showReviewDetail = false,
}) {
  const t = await getTranslations('common');
  const reviewsT = await getTranslations('reviews');
  const locale = await getLocale();

  const reviews = await fetchReviews(makeSlug, modelSlug, year);

  if (reviews) {
    return (
      <BaseCard className="gap-4 p-3 md:p-4">
        <div className="flex gap-3 justify-between">
          <div className="flex flex-col">
            <Text as="h5" className="font-semibold">
              {t('Reviews')}
            </Text>
            <LinkWithIcon
              icon={
                <ChevronRightIcon className="w-4 h-4 bg-primary-100 text-primary rounded-xs shrink-0 flipX" />
              }
              iconPosition={'right'}
              href={`/review/${makeSlug}/${modelSlug}/${reviews?.id}`}
              title={t('View Details')}
              className="text-primary text-xs hover:text-primary font-semibold items-center"
            />
          </div>
          <div className="flex items-center gap-1" dir="ltr">
            <span>
              <Star className={'w-6 h-6 text-yellow-400 fill-yellow-400'} />
            </span>
            <span className="text-3xl font-bold ms-1">{reviews?.ratings}</span>
            <span className="font-medium lg:text-xl text-gray-500">/5</span>
          </div>
        </div>

        {showReviewDetail && (
          <div className="grid grid-cols-2 gap-5">
            {reviews?.categories?.map((item) => (
              <div key={item?.label} className="w-full">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    {reviewsT(item?.label)}
                  </div>
                  <div
                    className="text-xs flex gap-1 items-center text-muted-foreground"
                    dir="ltr"
                  >
                    <Star className="inline w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <Text className="text-sm">{item?.value?.toFixed(1)}</Text>
                  </div>
                </div>
                <Progress
                  value={(item?.value / 10) * 100}
                  className="h-2 flipX"
                />
              </div>
            ))}
          </div>
        )}
      </BaseCard>
    );
  }
}
