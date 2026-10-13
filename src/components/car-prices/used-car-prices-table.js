import { fetchUsedCarPrices } from '@/apis/used-car-prices';
import PriceCard from '@/components/common/carPriceCardMobile/priceCard';
import Table from '@/components/common/table/table';
import { usedCarPriceCols } from '@/data/pricingTables/usedCars/usedCarPriceCols';
import { getLocaleString } from '@/utils/general';
import { isMobileServer } from '@/utils/serverFunctions';
import Pagination from '../common/pagination';
import { getTranslations } from 'next-intl/server';
import { notFound, redirect } from 'next/navigation';

export async function UsedCarPricesTable(props) {
  const {
    make,
    model,
    sectionTitle,
    showPagination = false,
    page,
    locale,
    min,
    max,
    sortParam,
    monthFilter,
    limit,
    redirectTo = null,
  } = props || {};
  const { data, pagination, error } = await fetchUsedCarPrices({
    page: page,
    make: make,
    model: model,
    min: min,
    max: max,
    sortParam: sortParam,
    monthFilter: monthFilter,
    limit: limit,
  });

  if (error) {
    notFound();
  }

  if ((min || max || page) && !data?.length && redirectTo) {
    redirect(redirectTo);
  }

  if (page && page > pagination?.total_pages && redirectTo) {
    redirect(redirectTo);
  }

  const isMobile = await isMobileServer();
  const t = await getTranslations('carPrices');

  const dataWithHrefs = data?.map((item) => ({
    ...item,
    title: {
      ...item.title,
      hrefTitle: t('used_car_prices', {
        label: getLocaleString(item?.title, 'text', locale),
      }),
    },
  }));

  return (
    dataWithHrefs?.length > 0 && (
      <div>
        {sectionTitle && <h2 className="sectionHeading">{sectionTitle}</h2>}
        {!isMobile ? (
          <Table
            data={dataWithHrefs}
            columns={usedCarPriceCols}
            pagination={!!showPagination && pagination}
            locale={locale}
          />
        ) : (
          <div className="flex flex-col gap-2">
            {dataWithHrefs.map((item) => (
              <PriceCard
                key={item.id}
                href={item.title.href}
                title={getLocaleString(item.title, 'text', locale)}
                avgPrice={item.avgPrice}
                minPrice={item.minPrice}
                maxPrice={item.maxPrice}
              />
            ))}
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
        )}
      </div>
    )
  );
}
