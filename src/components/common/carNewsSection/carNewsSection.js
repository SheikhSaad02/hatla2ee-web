import { getLocale, getTranslations } from 'next-intl/server';

import { listingJumpLinks } from '@/data/detail';
import { BASE_URL } from '@/constants';
import CarouselSection from '../carouselSection/carouselSection';
import { ChevronRightIcon } from 'lucide-react';
import ClickEventTracker from '@/services/analyticsService/clickTracker';
import { IBM_PLEX } from '@/utils/fonts';
import LinkWithIcon from '../linkWithIcon/linkWithIcon';
import NewsCard from '../newsCard/newsCard';
import { cn } from '@/utils';
import { fetchCarNews } from '@/apis/car-news';
import { getAsset } from '@/utils/general';
import {
  PAGE_SECTIONS,
  PAGE_TYPES,
} from '@/services/analyticsService/constants';
import { isWebViewServer, isMobileServer } from '@/utils/serverFunctions';

const CarNewsSection = async ({ pageType = '' }) => {
  const t = await getTranslations('common');
  const locale = await getLocale();
  const isWebView = await isWebViewServer();
  const carNews = await fetchCarNews(locale);
  const isMobile = await isMobileServer();
  return (
    carNews &&
    Array.isArray(carNews) &&
    carNews.length > 0 && (
      <div id={listingJumpLinks.CAR_NEWS} className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="sectionHeading mb-0">{t('Latest Car News')}</h2>
          {!isWebView && (
            <LinkWithIcon
              icon={
                <ChevronRightIcon className="w-4 h-4 text-primary rounded-xs rtl:rotate-180 self-center shrink-0" />
              }
              iconPosition={'right'}
              href={`${BASE_URL}/news${locale == 'en' ? `/${locale}` : ''}`}
              title={isMobile ? t('View All') : t('View All News')}
              className="text-primary justify-evenly text-xs md:text-sm  hover:text-primary lg:font-bold gap-1"
              localized={false}
              prefetch={false}
              gaEvent="view_all_link_click"
              pageType={PAGE_TYPES.HOME}
              pageSection={PAGE_SECTIONS.LATEST_CAR_NEWS}
            />
          )}
        </div>
        <CarouselSection
          className="h-full w-full"
          itemBasis="basis-[70%] sm:basis-[60%] md:basis-[40%] lg:basis-[27%]"
          pageSection={PAGE_SECTIONS.LATEST_CAR_NEWS}
        >
          {carNews?.map((item, index) => (
            <ClickEventTracker
              key={index}
              article={item?.title}
              pageType={pageType}
              gaEvent={'car_news_click'}
            >
              <NewsCard
                key={`varient-${index}`}
                imageAltText={item?.title}
                title={item?.title}
                image={item?.image || getAsset('/assets/Latest_Car_News.png')}
                date={item.post_date}
                href={item?.url}
                tags={[item?.categories[0]?.title]}
                className={cn(`flex flex-col h-full`, IBM_PLEX?.className)}
              />
            </ClickEventTracker>
          ))}
        </CarouselSection>
      </div>
    )
  );
};

export default CarNewsSection;
