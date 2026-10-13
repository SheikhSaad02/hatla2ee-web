import PriceCard from '@/components/common/carPriceCardMobile/priceCard';
import Table from '@/components/common/table/table';
import { getLocaleString } from '@/utils/general';
import { isMobileServer } from '@/utils/serverFunctions';
import Pagination from '../common/pagination';
import { newCarPriceChangesColumns } from '@/data/pricingTables/newCars/newCarPriceCols';
import { getPriceChanges } from '@/apis/new-car-prices';
import { getTranslations } from 'next-intl/server';
import { ifError } from '@/utils/ifError';

export async function NewCarPriceChangesTable(props) {
  const {
    make,
    model,
    page,
    locale,
    min,
    max,
    limit,
    sectionTitle,
    sectionLink,
    showPagination = false,
    vehicle,
  } = props || {};
  const response = await getPriceChanges({
    makeSlug: make,
    modelSlug: model,
    page,
    min,
    max,
    limit,
    vehicle,
  });
  ifError(response);
  const { data, pagination } = response;
  const isMobile = await isMobileServer();
  const t = await getTranslations('carPrices');

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
      <div className="flex flex-col gap-4">
        {sectionTitle && (
          <div className="flex flex-row justify-between items-center text-sm md:text-base">
            <h2 className="sectionHeading mb-0">{sectionTitle}</h2>
            {sectionLink && <span>{sectionLink}</span>}
          </div>
        )}
        {!isMobile ? (
          <Table
            data={dataWithHrefs}
            columns={newCarPriceChangesColumns}
            pagination={!!showPagination && pagination}
            locale={locale}
          />
        ) : (
          <div className="flex flex-col gap-2">
            {dataWithHrefs.map((item, index) => (
              <PriceCard
                key={item.id || index}
                isPriceChange={true}
                href={item.overview.href}
                title={getLocaleString(item.overview, 'title', locale)}
                description={getLocaleString(item.overview, 'features', locale)}
                oldPrice={item.oldPrice}
                newPrice={item.newPrice}
                priceChange={item.priceChange}
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
