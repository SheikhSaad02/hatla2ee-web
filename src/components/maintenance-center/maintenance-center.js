import DealerCard from '../common/dealerCard/dealerCard';
import Pagination from '../common/pagination';
import { getLocale } from 'next-intl/server';
import { getAsset, getLocaleString } from '@/utils/general';

const MantainenceCenters = async ({ maintenanceCenterData }) => {
  const locale = await getLocale();

  return (
    maintenanceCenterData?.maintenanceCenters && (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-6 mb-6">
          {maintenanceCenterData?.maintenanceCenters?.map((data, index) => (
            <DealerCard
              key={index}
              title={getLocaleString(data, 'title', locale)}
              location={getLocaleString(data?.location, 'name', locale)}
              phone={data?.phone}
              image={{
                src:
                  data?.image ||
                  getAsset('/assets/maintenance-placeholder.webp'),
              }}
              href={data?.href}
              // className="flex flex-col h-full"
              titleClassName="block"
              imageClassName={!data?.image && 'object-cover'}
            />
          ))}
        </div>
        <Pagination
          className="pagination-bar"
          currentPage={maintenanceCenterData?.pagination?.current_page}
          totalCount={maintenanceCenterData?.pagination?.total_count}
          pageSize={32}
          totalPages={maintenanceCenterData?.pagination?.total_pages}
        />
      </div>
    )
  );
};
export default MantainenceCenters;
