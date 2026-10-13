
import PageLayout from '@/components/layout/pageLayout';
import { Skeleton } from '@/components/ui/skeleton';

export default function ListingDetailLoading() {
  return (
    <PageLayout route="detail-page">
      
        {/* Top bar: breadcrumbs + actions */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-40" />
          <div className="flex gap-2">
            <Skeleton className="h-4 w-16 rounded-md" />
            <Skeleton className="h-4 w-16 rounded-md" />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Skeleton className="h-12 w-200" />
          <div className="flex gap-2">
            <Skeleton className="h-12 w-24 rounded-md" />
          </div>
        </div>

        {/* Hero image / gallery */}
        <div className="flex flex-col gap-4">
          <Skeleton className="h-[300px] md:h-[400px] w-full rounded-md" />
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-3">
          {/* Left/content column */}
          <div className="col-span-2 lg:pe-13 space-y-6">
            {/* Title + quick specs */}
            <div className="space-y-3">
              <Skeleton className="h-8 w-3/4" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-md" />
                ))}
              </div>
            </div>

            {/* Specifications section */}
            <div className="space-y-3">
              <Skeleton className="h-6 w-40" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-md" />
                ))}
              </div>
            </div>

            {/* Description / expandable text */}
            <div className="space-y-3">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-28 w-full rounded-md" />
            </div>

            {/* Features */}
            <div className="space-y-3">
              <Skeleton className="h-6 w-40" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-md" />
                ))}
              </div>
            </div>
          </div>

          {/* Right/sidebar column */}
          <div className="flex flex-col gap-6 mt-7 lg:mt-0">
            {/* Contact card */}
            <div className="space-y-3">
              <Skeleton className="h-40 w-full rounded-md" />
              <div className="grid grid-cols-2 gap-2">
                <Skeleton className="h-9 w-full rounded-md" />
                <Skeleton className="h-9 w-full rounded-md" />
              </div>
            </div>

            {/* Reviews summary */}
            <div className="space-y-3">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-24 w-full rounded-md" />
            </div>

            {/* Price ranges chart */}
            <div className="space-y-3">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-36 w-full rounded-md" />
            </div>
          </div>
        </div>

        {/* Related sections */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-56" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-md" />
            ))}
          </div>
        </div>
      
    </PageLayout>
  );
}
