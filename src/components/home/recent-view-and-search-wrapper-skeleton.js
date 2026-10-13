import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils';

// Skeleton component for Recent Searches section
function RecentSearchesSkeleton({ isMobile }) {
  return (
    <div className="flex flex-col">
      <Skeleton className="h-8 w-40 mb-4" /> {/* Section heading */}
      <div className="max-h-88">
        <div
          className={cn(
            'flex gap-3',
            isMobile ? 'flex-row overflow-x-auto pb-2' : 'flex-col',
          )}
        >
          {Array.from({ length: isMobile ? 1 : 3 }).map((_, index) => (
            <div
              key={index}
              className={cn(
                'flex-shrink-0',
                isMobile ? 'min-w-[280px]' : 'w-full',
              )}
            >
              <div className="py-3 px-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-2 flex-1">
                    <Skeleton className="h-4 w-32" /> {/* Title */}
                    <div className="flex gap-2">
                      <Skeleton className="h-3 w-20" /> {/* Property 1 */}
                      <Skeleton className="h-3 w-16" /> {/* Property 2 */}
                      <Skeleton className="h-3 w-24" /> {/* Property 3 */}
                    </div>
                  </div>
                  <Skeleton className="h-6 w-6 ml-2" /> {/* Icon */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Skeleton component for Recently Viewed cars section
function RecentlyViewedSkeleton({ isMobile }) {
  return (
    <div className="min-w-0">
      <Skeleton className="h-8 w-36 mb-4" /> {/* Section heading */}
      <div className="h-full w-full mb-10">
        <div
          className={cn(
            'flex gap-4',
            isMobile ? 'overflow-x-auto pb-2' : 'flex-wrap',
          )}
        >
          {Array.from({ length: isMobile ? 1 : 2 }).map((_, index) => (
            <div
              key={index}
              className={cn(
                'flex-shrink-0',
                isMobile
                  ? 'basis-[80%] md:basis-[55%] lg:basis-[43%]'
                  : 'basis-[43%]',
              )}
            >
              <div className="flex flex-col h-full border rounded-lg overflow-hidden">
                {/* Image skeleton */}
                <Skeleton className="h-48 w-full" />

                {/* Content skeleton */}
                <div className="flex flex-col flex-1 p-3">
                  {/* Title */}
                  <Skeleton className="h-4 w-full mb-2" />

                  {/* Properties */}
                  <div className="flex gap-2 mb-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-14" />
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1 mb-4">
                    <Skeleton className="h-3 w-3" />
                    <Skeleton className="h-3 w-24" />
                  </div>

                  {/* Price and CTA buttons */}
                  <div className="flex justify-between items-end mt-auto">
                    <div className="flex flex-col gap-1">
                      <Skeleton className="h-6 w-24" /> {/* Price */}
                      <Skeleton className="h-3 w-16" /> {/* Currency */}
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-8 rounded-lg" />{' '}
                      {/* WhatsApp */}
                      <Skeleton className="h-8 w-8 rounded-lg" /> {/* Phone */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Main skeleton component
export function RecentlyViewedAndSearchedSkeleton({ isMobile }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[425px_1fr] gap-5">
      <RecentSearchesSkeleton isMobile={isMobile} />
      <RecentlyViewedSkeleton isMobile={isMobile} />
    </div>
  );
}
