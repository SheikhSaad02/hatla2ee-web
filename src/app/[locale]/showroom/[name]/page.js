import {
  getLocaleStringServer,
  isMobileServer,
  isWebViewServer,
} from '@/utils/serverFunctions';

import PageLayout from '@/components/layout/pageLayout';
import ShowRoomCars from '@/components/showroom/show-room-cars';
import ShowRoomDetail from '@/components/showroom/showroom-detail';
import ShowRoomLocations from '@/components/showroom/showroom-locations';
import { ShowRoomService } from '@/services/elasticsearch/showroom';
import StickyDetialInfo from '@/components/common/stickyDetialInfo/stickyDetialInfo';
import { fetchShowroomDetail } from '@/apis/showroom';
import { fetchMakeInfo } from '@/apis/make';
import { getTranslations } from 'next-intl/server';
import { getLocaleString } from '@/utils/general';
import { ShowroomSEOStrategy } from '@/services/seoStrategy/showroomPage';
import { appPaths } from '@/constants';
import { redirect } from 'next/navigation';
import { decodeSearchParams } from '@/utils/url';

export async function generateMetadata({ params, searchParams }) {
  const { locale, name } = await params;
  const { make, page, condition } = decodeSearchParams(await searchParams);

  const [listingDetailData, makeData] = await Promise.all([
    fetchShowroomDetail(name),
    make ? fetchMakeInfo(make) : Promise.resolve(null),
  ]);
  const makeLabel = await getLocaleStringServer(makeData, 'label');

  const showroomSEO = new ShowroomSEOStrategy({
    language: locale,
    listingDetailData,
    isDetailPage: true,
    make,
    makeLabel,
    condition,
    page,
  });

  const seoData = await showroomSEO.generateSEO();

  return {
    title: seoData.metaTitle,
    description: seoData.metaDescription,
    robots: seoData.robotsTag,
  };
}

const ShowroomDetailPage = async ({ params, searchParams }) => {
  const { name, locale } = await params;
  const { make, page, condition } = decodeSearchParams(await searchParams);
  const isMob = await isMobileServer();
  const isWebView = await isWebViewServer();
  const listingDetailData = await fetchShowroomDetail(name);
  const makesData = await ShowRoomService.getShowroomAdsByMake(
    decodeURIComponent(name),
    make,
    condition === 'used' ? condition : 'new',
  );

  if (!Object.keys(listingDetailData))
    redirect(`/${locale}${appPaths.usedShowrooms}`);
  else if (make && !makesData?.length)
    redirect(`/${locale}${appPaths.usedShowrooms}/${name}`);
  const showroomTitle = await getLocaleStringServer(listingDetailData, 'name');

  return (
    <PageLayout route="showroom-detail">
      {isMob && !isWebView && (
        <StickyDetialInfo
          title={showroomTitle}
          image={{ thumbnail: listingDetailData?.agency_logo }}
          mobileElement={'showroom-detail'}
          showWishlist={false}
          headerClass="items-center"
          titleClassName="font-semibold"
        />
      )}
      <div id="showroom-detail">
        <ShowRoomDetail
          listingDetailData={listingDetailData}
          isWebView={isWebView}
          isMobile={isMob}
        />
      </div>

      <div
        className={`grid gap-5 grid-cols-1 ${
          listingDetailData?.addresses?.length > 0
            ? 'lg:grid-cols-[268px_minmax(0,1fr)]'
            : 'lg:grid-cols-1'
        }`}
      >
        {listingDetailData?.addresses?.length > 0 && !isMob && (
          <ShowRoomLocations listingDetailData={listingDetailData} />
        )}

        <ShowRoomCars
          listingDetailData={listingDetailData}
          page={page || 1}
          condition={condition}
          makes={make}
          makesData={makesData}
          showroomSlug={name}
        />
      </div>
    </PageLayout>
  );
};

export default ShowroomDetailPage;
