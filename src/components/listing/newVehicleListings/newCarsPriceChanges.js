import Table from '@/components/common/table/table';
import Text from '@/components/common/text';
import { newCarPriceChangesColumns } from '@/data/pricingTables/newCars/newCarPriceCols';
import PriceCard from '@/components/common/carPriceCardMobile/priceCard';
import { getPriceChanges } from '@/apis/new-car-prices';
import { getLocaleStringServer } from '@/utils/serverFunctions';
import { getTranslations } from 'next-intl/server';
import { getLocaleString } from '@/utils/general';
import { listingJumpLinks } from '@/data/detail';

export async function NewCarsPriceChanges({
  title,
  makeSlug,
  modelSlug,
  variantId,
  isMobile,
  locale,
  listing_category,
}) {
  const t = await getTranslations('common');
  const carPriceT = await getTranslations('carPrices');

  const { data: priceChangesData } = await getPriceChanges({
    makeSlug,
    modelSlug,
    variantId,
    vehicle: listing_category?.slug,
  });

  if (!priceChangesData || priceChangesData?.length === 0) {
    return null;
  }

  const dataWithHrefs = priceChangesData?.map((item) => ({
    ...item,
    overview: {
      ...item.overview,
      hrefTitle: carPriceT('new_car_prices', {
        label: getLocaleString(item?.overview, 'title', locale),
      }),
    },
  }));

  return (
    <div id={listingJumpLinks.PRICE_CHANGES}>
      <>
        {title && (
          <Text as="h2" className="sectionHeading">
            {t('Latest Changes in ')}
            {title} {t('Prices')}
          </Text>
        )}
        {!isMobile ? (
          <Table
            data={dataWithHrefs}
            columns={newCarPriceChangesColumns}
            locale={locale}
          />
        ) : (
          <div className="flex flex-col gap-4 lg:gap-6">
            {priceChangesData?.map(async (item, index) => (
              <PriceCard
                key={item.id || index}
                id={item?.id}
                isPriceChange={true}
                href={item.overview.href}
                title={await getLocaleStringServer(item?.overview, 'title')}
                description={await getLocaleStringServer(
                  item.overview,
                  'features',
                )}
                oldPrice={item.oldPrice}
                newPrice={item.newPrice}
                priceChange={item.priceChange}
              />
            ))}
          </div>
        )}
      </>
    </div>
  );
}

export default NewCarsPriceChanges;
