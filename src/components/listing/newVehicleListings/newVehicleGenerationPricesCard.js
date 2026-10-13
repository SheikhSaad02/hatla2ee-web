import { fetchNewListingPricesMakeLevelDetail } from '@/apis/listing';
import Text from '@/components/common/text';
import { isMobileServer } from '@/utils/serverFunctions';
import { getLocale, getTranslations } from 'next-intl/server';
import BaseCard from '../../common/baseCard/baseCard';
import { CardContent } from '../../ui/card';
import NextImage from '../../common/nextImage';
import NextLink from '../../common/nextLink';
import Table from '../../common/table/table';
import PriceCard from '../../common/carPriceCardMobile/priceCard';
import { getYearRange } from '@/utils/date';
import { newCarVariantsPriceColumns } from '@/data/pricingTables/newCars/newCarVariantsPriceCols';
import { getLocaleString, mapFeaturesToStrings } from '@/utils/general';
import { getCarPricesAdUnits } from '@/components/googleAd/adsConfig';
import AdBanner from '@/components/googleAd/adBanner';
export const NewVehicleGenerationPricesCard = async ({ make, vehicle }) => {
  const isMobile = await isMobileServer();
  const locale = await getLocale();
  const commonT = await getTranslations({ locale, namespace: 'common' });
  const t = await getTranslations({ locale, namespace: 'carPrices' });
  const { listings } = await fetchNewListingPricesMakeLevelDetail({
    makeSlug: make,
    vehicle,
    locale,
  });
  const AD_UNITS = getCarPricesAdUnits(isMobile, locale, 'new', make, vehicle);
  return (
    <>
      {listings?.map((listing, index) => (
        <BaseCard
          key={index}
          className="flex md:rounded-xl p-0 max-lg:border-0"
        >
          <CardContent key={listing?.id} className="flex flex-col gap-2">
            <BaseCard className="flex flex-col bg-gray-50 lg:bg-white card-light max-lg:rounded-none max-lg:mx-[-1rem]">
              <CardContent className="flex flex-col md:flex-row md:items-center gap-2 md:gap-10 py-4 md:py-6 md:pb-2 px-4">
                <NextImage
                  width={160}
                  height={100}
                  className="w-[80px] h-[50px] md:w-[160px] md:h-[100px] aspect-8/5 object-contain"
                  src={listing?.modelImage}
                />
                <div className="flex flex-col gap-1">
                  <Text as="h3" className="text-base md:text-2xl font-semibold">
                    {vehicle === 'car'
                      ? `${commonT('New')} ${listing?.title} ${commonT(
                          'price',
                        )} ${getYearRange()}`
                      : `${commonT('New')} ${listing?.title} ${t(
                          vehicle,
                        )} ${commonT('price')} ${getYearRange()}`}
                  </Text>
                  <NextLink
                    href={listing.href}
                    title={`${listing.makeModelLabel} ${commonT(
                      'New Cash or Installment',
                    )}`}
                    className={'fs-body text-primary font-semibold'}
                  >
                    {listing?.makeModelLabel}
                  </NextLink>
                </div>
              </CardContent>
            </BaseCard>

            {!isMobile ? (
              <Table
                data={listing?.variantsTableData}
                columns={newCarVariantsPriceColumns}
                locale={locale}
                wrapperClassName="border-none rounded-t-none"
              />
            ) : (
              listing?.variantsTableData?.map((item, idx) => (
                <PriceCard
                  key={item.id || idx}
                  isNewCar={true}
                  href={item.overview.href}
                  title={getLocaleString(item.overview, 'title', locale)}
                  description={mapFeaturesToStrings(
                    item?.overview?.features,
                    locale,
                  )}
                  officialPrice={item.officialPrice}
                  marketPrice={item.marketPrice}
                />
              ))
            )}
          </CardContent>
          {index === 0 && isMobile && (
            <AdBanner adConfig={AD_UNITS?.carPricesMakeAd} />
          )}
        </BaseCard>
      ))}
    </>
  );
};
