import { fetchListingComparison } from '@/apis/listing';
import ComparisonCard from '../common/comapareModels/comparisonCard';
import SellCarBanner from '../common/sellCarBanner.js';
import Text from '../common/text';
import Pagination from '../common/pagination';
import React from 'react';
import { getTranslations } from 'next-intl/server';
import { getLocale } from 'next-intl/server';

const AllComparisons = async ({ page = 1, per_page = 100 }) => {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'carComparison' });
  const result = await fetchListingComparison(null, null, page, per_page);
  const comparisons = result?.data;
  const pagination = result?.pagination;

  if (!comparisons?.length) {
    return (
      <div className="text-center py-8">
        <Text className="text-gray-500">{t('No comparisons found')}</Text>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {comparisons.map((item, index) => (
        <React.Fragment key={item?.id || index}>
          <ComparisonCard
            id={item?.id}
            listingsData={item?.listings_data}
            isFullWidth={true}
          />
          {index === 4 && <SellCarBanner />}
        </React.Fragment>
      ))}

      {pagination && (
        <Pagination
          currentPage={pagination.current_page}
          totalPages={pagination.total_pages}
          totalCount={pagination.total_count}
        />
      )}
    </div>
  );
};

export default AllComparisons;
