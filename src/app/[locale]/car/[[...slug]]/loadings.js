import {
  CarListingGridSkeleton,
  FilterSkeleton,
  PaginationSkeleton,
} from '@/components/common/loading';

import PageLayout from '@/components/layout/pageLayout';
import { Skeleton } from '@/components/ui/skeleton';

export default function CarListingLoading() {
  return (
    <PageLayout>
      <div className="flex flex-col gap-5 pt-7 pb-16">
        {/* Header */}

        <div className="space-y-4">
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-10 flex-1 rounded-md" />
          <div className="flex space-x-2 justify-between">
            <Skeleton className="h-4 w-20 rounded-md" />
            <Skeleton className="h-10 w-20 rounded-md" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[268px_1fr] gap-5">
          {/* Filters */}
          <div className="w-[268px]">
            <FilterSkeleton />
          </div>

          {/* Content */}
          <CarListingGridSkeleton count={8} />

          {/* Pagination */}
          <PaginationSkeleton />
        </div>
      </div>
    </PageLayout>
  );
}
