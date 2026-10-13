import { fetchNewCarPrices } from '@/apis/new-car-prices';
import PriceCard from '@/components/common/carPriceCardMobile/priceCard';
import Table from '@/components/common/table/table';
import { newCarPriceColumns } from '@/data/pricingTables/newCars/newCarPriceCols';
import { getLocaleString, mapFeaturesToStrings } from '@/utils/general';
import { isMobileServer } from '@/utils/serverFunctions';
import Pagination from '../common/pagination';
import { getTranslations } from 'next-intl/server';
import Text from '../common/text';
import { formatDate } from '@/utils/date';
import { redirect } from 'next/navigation';

const NewCarPricesTable = async (props) => {
  const {
    makeSlug,
    sectionTitle,
    showPagination = false,
    page,
    locale,
    min,
    max,
    vehicle,
    showUpdateDate = false,
    limit,
    redirectTo = null,
  } = props || {};
  const { meta, data, pagination } = await fetchNewCarPrices({
    make: makeSlug,
    page,
    min,
    max,
    vehicle,
    limit,
  });

  if (page > pagination?.total_pages && redirectTo) {
    redirect(redirectTo);
  }

  const isMobile = await isMobileServer();
  const t = await getTranslations({ locale, namespace: 'carPrices' });
  const dataWithHrefs = data?.map((item) => ({
    ...item,
    overview: {
      ...item.overview,
      hrefTitle: t('new_car_prices', {
        label: getLocaleString(item?.overview, 'title', locale),
      }),
    },
  }));

  return (
    dataWithHrefs.length > 0 && (
      <div>
        {sectionTitle && (
          <h2 className="sectionHeading mb-4">{sectionTitle}</h2>
        )}
        {showUpdateDate && meta?.dateUpdated && (
          <Text as="p" className="mb-2 text-sm text-gray-500 italic text-end">
            {`${t('Last Reviewed')} (${formatDate(
              new Date(meta?.dateUpdated),
            )})`}
          </Text>
        )}
        {isMobile ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              {dataWithHrefs.map((item) => (
                <PriceCard
                  key={item.id}
                  image={item.overview.image}
                  href={item?.overview.href}
                  title={getLocaleString(item.overview, 'title', locale)}
                  description={mapFeaturesToStrings(
                    item?.overview?.features,
                    locale,
                  )}
                  officialPrice={item.officialPrice}
                  marketPrice={item.marketPrice}
                  isNewCar={true}
                />
              ))}
            </div>
            {!!showPagination && (
              <Pagination
                className="pagination-bar"
                currentPage={pagination?.current_page}
                totalCount={pagination?.total_count}
                pageSize={pagination?.page_size || 10}
                totalPages={pagination?.total_pages}
              />
            )}
          </div>
        ) : (
          <Table
            data={dataWithHrefs}
            columns={newCarPriceColumns}
            pagination={!!showPagination && pagination}
            locale={locale}
          />
        )}
      </div>
    )
  );
};
export default NewCarPricesTable;
