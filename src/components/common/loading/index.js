'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils';
import BaseCard from '../baseCard/baseCard';

// Basic card skeleton
export function DealerCardSkeleton() {
  return (
    <div className="flex flex-col ">
      <Skeleton className="h-[190px] w-full rounded-t-xl rounded-b-none" />
      <div className="space-y-2 p-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[80%]" />
      </div>
    </div>
  );
}

// Car listing card skeleton
export function CarListingSkeleton() {
  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <Skeleton className="h-40 lg:h-48 w-full rounded-b-none" />
      <div className="p-3 lg:p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/3" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-10 w-full mt-4" />
      </div>
    </div>
  );
}

// New Car Card Skeleton
export function NewCarCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

// Car listing grid skeleton
export function CarListingGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <CarListingSkeleton key={index} />
      ))}
    </div>
  );
}

export function GarageCarGridSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 items-start justify-items-start gap-6 md:grid-cols-2">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          className="box-border h-[248px] w-full max-w-[592px] rounded-2xl"
        />
      ))}
    </div>
  );
}

// Table skeleton
export function TableSkeleton({ rows = 5, columns = 4, className }) {
  return (
    <div className={cn('space-y-2', className)}>
      {/* Header */}
      <div className="flex space-x-2">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} className="h-8 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-2">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-6 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

// Filter skeleton
export function FilterSkeleton() {
  return (
    <div className="space-y-3 border p-4 rounded-xl">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Skeleton className="h-12 w-full" />
        </div>
      ))}
    </div>
  );
}

// Pagination skeleton
export function PaginationSkeleton() {
  return (
    <div className="flex justify-center space-x-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-8 w-8 rounded-md" />
      ))}
    </div>
  );
}

// Option Card Skeleton
function OptionCardSkeleton({ locale, className }) {
  const isRTL = locale === 'ar';

  // Mirrors OptionCard's contained layout with the same CSS toggle: text inside
  // the card on desktop, below/outside on mobile — same `lg:` breakpoint, so the
  // skeleton→content swap is shift-free.
  const textSkeleton = (visibilityClass) => (
    <div
      className={cn(
        'flex flex-col justify-center items-center gap-1',
        visibilityClass,
      )}
    >
      <Skeleton className="h-3.5 lg:h-3 w-14 lg:w-16" />
      <Skeleton className="h-3 lg:h-2 w-8" />
    </div>
  );

  return (
    <div
      className={cn(
        'flex flex-col text-center gap-2 group',
        isRTL && 'rtl',
        className,
      )}
    >
      {/* Image/Icon container - matches real OptionCard dimensions */}
      <BaseCard className="w-full border-none rounded-lg bg-gray-50 lg:gap-0 lg:pb-2">
        <div className="flex h-[54px] lg:h-[70px] p-1 flex-col justify-center items-center gap-[5.4px]">
          <Skeleton className="w-12 h-8 lg:w-16 lg:h-12 rounded" />
        </div>
        {/* Desktop: text inside the card */}
        {textSkeleton('hidden lg:flex lg:flex-row')}
      </BaseCard>
      {/* Mobile: text below, outside the card */}
      {textSkeleton('lg:hidden')}
    </div>
  );
}

export function OptionChipSkeleton({ locale }) {
  const isRTL = locale === 'ar';

  return (
    <div
      className={cn(
        'px-4 py-2 bg-gray-50 rounded-md text-sm whitespace-nowrap inline-flex items-center gap-1 h-9',
        isRTL && 'rtl',
      )}
    >
      {/* <Skeleton className="w-3 h-3 rounded" />
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-3 w-6" /> */}
    </div>
  );
}

export function MakeModelTabsCompactSkeleton({ isMobile, className }) {
  return (
    <div className={cn('space-y-4 min-h-60 lg:min-h-83', className)}>
      {/* Tabs Header Skeleton */}
      <div className="flex items-center gap-4 border-b overflow-x-auto hide-scrollbar">
        {Array.from({ length: isMobile ? 3 : 6 }).map((_, index) => (
          <div key={index} className="flex py-4 px-2 lg:px-4">
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>

      {/* Items Grid - 2 rows with basis matching actual component */}
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: isMobile ? 6 : 16 }).map((_, index) => (
          <div
            key={index}
            className="basis-[30%] md:basis-[23%] lg:basis-[11.5%] flex-shrink-0"
          >
            <OptionCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}

// Filter Tabs Skeleton - matches FilterTabs component structure
export function FilterTabsSkeleton({ isMobile }) {
  return (
    <div className="space-y-4 min-h-60 lg:min-h-83">
      {/* Tabs Header */}
      <div className="flex items-center gap-4 border-b overflow-x-auto hide-scrollbar">
        {Array.from({ length: isMobile ? 3 : 5 }).map((_, index) => (
          <div key={index} className="flex py-4 px-2 lg:px-4">
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>

      {/* Items Grid - 2 rows with basis matching actual component */}
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: isMobile ? 6 : 16 }).map((_, index) => (
          <div
            key={index}
            className="basis-[30%] md:basis-[23%] lg:basis-[11.5%] flex-shrink-0"
          >
            <OptionCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}

// Recently Viewed Section Skeleton
export function RecentlyViewedSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-7 w-35 lg:h-8 lg:w-48" />
      <div className="flex gap-3 overflow-x-auto pb-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex-shrink-0">
            <Skeleton className="h-20 w-32 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Make Model Tabs Skeleton
export function MakeModelTabsSkeleton({ isMobile }) {
  return (
    <div className="space-y-4 min-h-60 lg:min-h-83">
      {/* Tabs Header */}
      <div className="flex items-center gap-4 border-b overflow-x-auto hide-scrollbar">
        {Array.from({ length: isMobile ? 3 : 6 }).map((_, index) => (
          <div key={index} className="flex py-4 px-2 lg:px-4">
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>

      {/* Items Grid - 2 rows with basis matching actual component */}
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: isMobile ? 6 : 16 }).map((_, index) => (
          <div
            key={index}
            className="basis-[30%] md:basis-[23%] lg:basis-[11.5%] flex-shrink-0"
          >
            <OptionCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}

// Used Cars Catalog Skeleton
export function UsedCarsCatalogSkeleton({ isMobile }) {
  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-7 w-35 lg:h-8 lg:w-48" />
        <Skeleton className="h-5 w-28 lg:h-6 lg:w-32" />
      </div>

      <div
        className={cn(
          'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4',
          isMobile && 'pe-[20%]',
        )}
      >
        {Array.from({ length: isMobile ? 1 : 4 }).map((_, index) => (
          <CarListingSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

// Newly Launched Cars Skeleton
export function NewlyLaunchedCarsSkeleton({ isMobile }) {
  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-7 w-35 lg:h-8 lg:w-48" />
        <Skeleton className="h-5 w-28 lg:h-6 lg:w-32" />
      </div>

      <div
        className={cn(
          'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4',
          isMobile && 'pe-[20%]',
        )}
      >
        {Array.from({ length: isMobile ? 1 : 4 }).map((_, index) => (
          <NewCarCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

// Dealers Section Skeleton
export function DealersSectionSkeleton({ isMobile }) {
  return (
    <div className="space-y-4 lg:space-y-6">
      <Skeleton className="h-7 w-35 lg:h-8 lg:w-48" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {Array.from({ length: isMobile ? 2 : 5 }).map((_, index) => (
          <DealerCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

export function ShowroomCardSkeleton() {
  return (
    <div className="flex flex-col space-y-3 w-full">
      <Skeleton className="h-[125px] w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-5 w-3/4" />
      </div>
    </div>
  );
}

export function ShowroomsSectionSkeleton({ itemsCount }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
      {Array.from({ length: itemsCount }).map((_, index) => (
        <ShowroomCardSkeleton key={index} />
      ))}
    </div>
  );
}

// Popular Cities Skeleton
export function PopularCitiesSkeleton({ isMobile }) {
  return (
    <div className="space-y-4 lg:space-y-6">
      <Skeleton className="h-7 w-35 lg:h-8 lg:w-48" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {Array.from({ length: isMobile ? 6 : 18 }).map((_, index) => (
          <OptionChipSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

// Maintenance Center Cities Skeleton - matches MaintenanceCenterCities component structure
export function MaintenanceCenterCitiesSkeleton({ isMobile }) {
  // Match the 2-row grid structure used by the actual component
  const itemCount = isMobile ? 4 : 10;

  return (
    <div className="flex flex-col gap-2">
      {/* Title skeleton matching text-base height */}
      <Skeleton className="h-6 w-16" />

      {/* Grid matching MultilineCarousel's gridClassName for below-threshold items */}
      <div
        className={cn(
          'grid gap-3',
          isMobile
            ? 'grid-cols-2'
            : 'grid-cols-[repeat(auto-fill,minmax(180px,1fr))]',
        )}
      >
        {Array.from({ length: itemCount }).map((_, index) => (
          <Skeleton key={index} className="h-9 w-full rounded-md bg-gray-50" />
        ))}
      </div>
    </div>
  );
}

// Car News Section Skeleton
export function CarNewsSectionSkeleton({ isMobile }) {
  return (
    <div className="space-y-4 lg:space-y-6">
      <Skeleton className="h-7 w-35 lg:h-8 lg:w-48" />
      <div
        className={cn(
          'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4',
          isMobile && 'pe-[20%]',
        )}
      >
        {Array.from({ length: isMobile ? 1 : 3 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <Skeleton className="h-48 w-full" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// QuickFilters Widget Skeleton - matches FilterTabs component structure
export function QuickFiltersWidgetSkeleton({ isMobile, locale = 'en' }) {
  const isRTL = locale === 'ar';

  return (
    <div className={cn('space-y-4 min-h-70 lg:min-h-82', isRTL && 'rtl')}>
      {/* Tabs Header */}
      <div className="flex items-center gap-4 border-b overflow-x-auto hide-scrollbar">
        {Array.from({ length: isMobile ? 3 : 5 }).map((_, index) => (
          <div key={index} className="flex py-4 px-2 lg:px-4">
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>

      {/* Items Grid - 2 rows with basis matching actual component */}
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: isMobile ? 6 : 12 }).map((_, index) => (
          <div
            key={index}
            className="basis-[30%] md:basis-[23%] lg:basis-[11.5%] flex-shrink-0"
          >
            <OptionCardSkeleton locale={locale} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Featured Dealers Skeleton for listing pages
// min-h matches the loaded FeaturedDealers block so the grid below does not shift.
export function FeaturedDealersSkeleton({ count = 6 }) {
  return (
    <div className="flex min-h-[216px] flex-col gap-3">
      <Skeleton className="h-5 w-32" />
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-2 shrink-0"
          >
            <Skeleton className="w-[120px] h-[100px] rounded-md" />
            <Skeleton className="h-3 w-[80px]" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PriceRangeSkeleton() {
  return (
    <div className="bg-white rounded-lg border p-4 animate-pulse  bg-[linear-gradient(180deg,#FFFFFF_0%,#F4F8FE_100%)]">
      <div className="h-6 bg-gray-200 rounded w-32 mb-1"></div>
      <div className="h-4 bg-gray-200 rounded w-60 mb-4"></div>

      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col items-start">
          <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
          <div className="h-6 bg-gray-200 rounded w-24"></div>
        </div>

        <div className="flex flex-col items-center">
          <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
          <div className="h-6 bg-gray-200 rounded w-24"></div>
        </div>

        <div className="flex flex-col items-end">
          <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
          <div className="h-6 bg-gray-200 rounded w-24"></div>
        </div>
      </div>

      <div className="h-5 bg-gray-200 rounded-sm mb-2"></div>

      <div className="flex justify-center">
        <div className="bg-gray-200 rounded-lg p-2 relative flex flex-col items-center justify-center">
          <div className="h-3 bg-white rounded w-24 mb-2"></div>
          <div className="h-4 bg-white rounded w-36"></div>
        </div>
      </div>
    </div>
  );
}

export function ReviewsSkeleton() {
  return (
    <div className="bg-white rounded-lg border p-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-24 mb-4"></div>

      <div className="flex items-center justify-between mb-4">
        <div></div>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gray-200 rounded"></div>
          <div className="h-8 bg-gray-200 rounded w-12"></div>
          <div className="h-6 bg-gray-200 rounded w-8"></div>
        </div>
      </div>

      <div className="h-6 bg-blue-200 rounded w-40"></div>
    </div>
  );
}
export function RadioButtonsSkeleton({ locale }) {
  const isRTL = locale === 'ar';

  return (
    <div className="flex gap-2">
      <Skeleton className="h-8 w-16 rounded-2.5xl" />
      <Skeleton className="h-8 w-16 rounded-2.5xl" />
      <Skeleton className="h-8 w-16 rounded-2.5xl" />
      <Skeleton className="h-8 w-16 rounded-2.5xl" />
      <Skeleton className="h-8 w-16 rounded-2.5xl" />
      <Skeleton className="h-8 w-16 rounded-2.5xl" />
    </div>
  );
}
export function CarPricesTableSkeleton({
  rows = 10,
  columns = 4,
  className,
  isMobile,
}) {
  return isMobile ? (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="rounded-lg border p-3 space-y-1">
          <Skeleton className="h-4 w-40 rounded" />
          <Skeleton className="h-3 w-28 rounded" />

          {/* Prices row */}
          <div className="grid grid-cols-2 gap-1 mt-3">
            <Skeleton className="h-12 w-full rounded" />
            <Skeleton className="h-12 w-full rounded" />
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div>
      {/* <div className="py-5">
        <Skeleton className="h-6 w-56 rounded" />
      </div> */}
      <div
        className={cn('w-full rounded-lg border overflow-hidden', className)}
      >
        <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              className={cn('h-4 rounded', colIndex === 0 ? 'w-40' : 'w-28')}
            />
          ))}
        </div>

        <div className="divide-y divide-gray-100">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-4 gap-4 py-4 px-5">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton
                  key={colIndex}
                  className={cn(
                    'h-4 rounded',
                    colIndex === 0 ? 'w-40' : 'w-28',
                  )}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function NewVehicleGenerationPricesCardSkeleton({ count = 2 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <BaseCard
          key={index}
          className="flex md:rounded-xl p-0 max-lg:border-0"
        >
          <div className="flex flex-col gap-2">
            {/* Header section with image and title */}
            <BaseCard className="flex flex-col bg-gray-50 lg:bg-white card-light max-lg:rounded-none max-lg:mx-[-1rem]">
              <div className="w-100 flex flex-col md:flex-row md:items-center gap-2 md:gap-10 py-4 md:py-6 md:pb-2 px-4">
                {/* Image skeleton */}
                <div className="w-[80px] h-[50px] md:w-[160px] md:h-[100px] bg-gray-200 rounded animate-pulse" />

                {/* Title and link skeleton */}
                <div className="flex flex-col gap-2">
                  <div className="h-6 md:h-8 bg-gray-200 rounded animate-pulse w-48 md:w-64" />
                  <div className="h-4 md:h-5 bg-gray-200 rounded animate-pulse w-32 md:w-40" />
                </div>
              </div>
            </BaseCard>

            {/* Desktop table skeleton */}
            <div className="hidden md:block">
              <div className="border border-gray-200 rounded-t-none">
                {/* Table header */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 border-b">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
                </div>

                {/* Table rows */}
                {Array.from({ length: 3 }).map((_, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="grid grid-cols-3 gap-4 p-4 border-b border-gray-100"
                  >
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile price cards skeleton */}
            <div className="md:hidden space-y-3">
              {Array.from({ length: 3 }).map((_, cardIndex) => (
                <PriceCardSkeleton key={cardIndex} />
              ))}
            </div>
          </div>
        </BaseCard>
      ))}
    </div>
  );
}

export function NewVehicleGenerationPricesSkeleton({ isMobile, count = 2 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <BaseCard
          key={index}
          className="flex md:rounded-xl p-0 max-lg:border-0"
        >
          <div className="flex flex-col gap-2">
            {/* Header section with image and title */}
            <BaseCard className="flex gap-0 flex-col bg-gray-50 lg:bg-white card-light max-lg:rounded-none max-lg:mx-[-1rem]">
              <div className="flex  justify-between md:flex-row md:items-start gap-2 md:gap-10 md:justify-between py-4 md:py-6 md:pb-2 px-4">
                <div className="flex flex-col md:flex-row gap-6 md:items-center">
                  {/* Image skeleton */}
                  <div className="w-[105px] h-15 md:w-[325px] md:h-[216px] bg-gray-200 rounded animate-pulse" />

                  {/* Title and link skeleton */}
                  {!isMobile && (
                    <div className="flex flex-col gap-7">
                      <div className="h-6 md:h-8 bg-gray-200 rounded animate-pulse w-48 md:w-64" />
                      <div className="flex gap-10">
                        <div>
                          <div className="h-15 md:h-5  bg-gray-200 rounded animate-pulse w-35 md:w-20 mb-3" />

                          <div className=" sm:block hidden md:h-5 bg-gray-200 rounded animate-pulse w-32 md:w-50" />
                        </div>
                        <div>
                          <div className="h-15 md:h-5 bg-gray-200 rounded animate-pulse w-35 md:w-20 mb-3" />

                          <div className="sm:block hidden h-4 md:h-5 bg-gray-200 rounded animate-pulse w-32 md:w-50" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="h-8 bg-gray-200 rounded animate-pulse w-[150px]  md:w-50 md:h-10 md:mb-3" />
              </div>

              {isMobile && (
                <div className="p-4 flex flex-col gap-2">
                  <div className="h-6 md:h-8 bg-gray-200 rounded animate-pulse w-48 md:w-64" />
                  <div className="flex gap-10">
                    <div>
                      <div className="h-15 md:h-5  bg-gray-200 rounded animate-pulse w-35 md:w-20 mb-3" />

                      <div className=" sm:block hidden md:h-5 bg-gray-200 rounded animate-pulse w-32 md:w-50" />
                    </div>
                    <div>
                      <div className="h-15 md:h-5 bg-gray-200 rounded animate-pulse w-35 md:w-20 mb-3" />

                      <div className="sm:block hidden h-4 md:h-5 bg-gray-200 rounded animate-pulse w-32 md:w-50" />
                    </div>
                  </div>
                </div>
              )}
            </BaseCard>

            {/* Desktop table skeleton */}
            <div className="hidden md:block">
              <div className="border border-gray-200 rounded-t-none">
                {/* Table header */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 border-b">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
                </div>

                {/* Table rows */}
                {Array.from({ length: 3 }).map((_, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="grid grid-cols-3 gap-4 p-4 border-b border-gray-100"
                  >
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile price cards skeleton */}
            <div className="md:hidden space-y-3">
              {Array.from({ length: 3 }).map((_, cardIndex) => (
                <PriceCardSkeleton key={cardIndex} />
              ))}
            </div>
          </div>
        </BaseCard>
      ))}
    </div>
  );
}

export function PriceCardSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded shadow-sm border border-gray-200 animate-pulse">
      {/* Image skeleton */}
      <div className="w-20 h-12 bg-gray-200 rounded" />
      {/* Content skeleton */}
      <div className="flex flex-col flex-1 gap-2">
        <div className="h-5 bg-gray-200 rounded w-32" />
        <div className="h-4 bg-gray-200 rounded w-20" />
        <div className="h-4 bg-gray-200 rounded w-16" />
      </div>
    </div>
  );
}

export const PriceRangeChartSkeleton = ({ count = 3 }) => {
  return (
    <BaseCard className="gap-3 md:gap-4 p-3 md:p-4 border bg-[linear-gradient(180deg,#FFFFFF_0%,#F4F8FE_100%)]">
      <div className="flex flex-col w-full justify-between">
        {/* Min, Avg, Max price skeletons */}
        <div className="flex flex-row items-center justify-between w-full text-xs md:text-sm">
          <div className="flex flex-col items-start gap-1 text-left">
            <Skeleton className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            <Skeleton className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
          </div>

          <div className="flex flex-col items-end gap-1 text-right">
            <Skeleton className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            <Skeleton className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Chart bar skeleton */}
        <div className="relative w-full mt-1 md:mt-2">
          <Skeleton className="h-[14px] w-full bg-gray-200 rounded-full animate-pulse" />
        </div>
      </div>
    </BaseCard>
  );
};

export const ShowroomListingsSkeleton = ({ className, grids, itemsCount }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-${grids} gap-4`}>
      {Array.from({ length: itemsCount }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'rounded-2xl group flex flex-col h-full gap-0 py-0 overflow-hidden box-border bg-white',
            'hover:shadow-sm transition-shadow duration-300',
            className,
          )}
        >
          <div className="h-40 w-full bg-gray-200 animate-pulse" />

          <div className="flex flex-col p-4 gap-3">
            <div className="h-5 w-3/4 bg-gray-200 rounded-md animate-pulse" />

            <div className="h-4 w-1/2 bg-gray-200 rounded-md animate-pulse" />

            <div className="h-4 w-full bg-gray-200 rounded-md animate-pulse" />
            <div className="h-4 w-5/6 bg-gray-200 rounded-md animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Comparison Card Skeleton
export function ComparisonCardSkeleton({ isMobile }) {
  return (
    <BaseCard className="p-2 lg:p-5 gap-3 lg:gap-4 h-full group">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-6 w-64" />
        {!isMobile && <Skeleton className="h-8 w-32" />}
      </div>

      <div className="flex justify-center flex-1">
        <div className="flex">
          <div className="flex flex-col gap-3 lg:gap-5 p-0 lg:p-4 items-center text-center w-[150px] lg:w-[266px]">
            <Skeleton className="w-[120px] h-[140px] md:w-[200px]" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="w-0 border-l mx-3 my-2 lg:mx-8 lg:my-5 grid items-center">
            <Skeleton className="h-6 w-6 lg:h-10 lg:w-10 rounded-full -translate-x-1/2" />
          </div>
          <div className="flex flex-col gap-3 lg:gap-5 p-0 lg:p-4 items-center text-center w-[150px] lg:w-[266px]">
            <Skeleton className="w-[120px] h-[140px] md:w-[200px]" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>

      {isMobile && (
        <div className="flex justify-center">
          <Skeleton className="h-8 w-full mx-4" />
        </div>
      )}
    </BaseCard>
  );
}

// Compare Carousel Skeleton
export function CompareCarouselSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="flex gap-4 overflow-x-auto pb-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex-shrink-0 w-80">
            <ComparisonCardSkeleton isFullWidth={true} />
          </div>
        ))}
      </div>
    </div>
  );
}

// All Comparisons Skeleton
export function AllComparisonsSkeleton({ isMobile }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <ComparisonCardSkeleton key={index} isMobile={isMobile} />
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <div className="flex space-x-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-8 rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
}

// Comparison Detail Page Skeleton
export function ComparisonDetailSkeleton({ carCount = 3, className }) {
  return (
    <>
      {/* Add Another Car Button Skeleton */}
      <div className="flex justify-between max-md:hidden ">
        <div className="h-8 w-60 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="h-8 w-42 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>

      {/* Comparison Section */}
      <div className="flex overflow-x-auto lg:overflow-x-visible w-full gap-2 lg:gap-3">
        {/* Attribute Label Column */}
        <div className="w-36 md:w-56 lg:w-72 flex-shrink-0 flex flex-col rounded-lg bg-white sticky left-0 rtl:left-auto rtl:right-0 z-11">
          {/* Header Skeleton (Hide similarities) */}
          <div className="flex flex-col justify-start md:justify-between h-50 md:h-60 sticky md:top-10 z-10 bg-white">
            <div className="flex justify-start bg-gray-100 rounded-lg p-3 lg:p-4 md:mt-auto">
              <div className="flex items-center gap-3 bg-transparent max-sm:items-start max-sm:flex-col lg:flex-1 justify-between">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-12 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Attribute Labels */}
          <div className="space-y-0 flex-1 divide-y divide-gray-50">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center h-12 lg:h-16 px-2 lg:px-4"
              >
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Car Columns Skeleton */}
        <div className="flex gap-2 lg:gap-3 flex-1">
          {Array.from({ length: carCount }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col lg:flex-1 flex-shrink-0 rounded-lg lg:shadow border max-sm:w-48 bg-[linear-gradient(to_top,#F4F8FD_0%,white_100%)] relative flex-1"
            >
              {/* Close button */}
              <div className="absolute top-1 md:top-2 end-1 md:end-2 z-10 h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>

              {/* Car Info Header */}
              <div className="flex flex-col items-center text-center flex-none h-50 md:h-60 justify-center max-md:px-2 md:sticky md:top-10 z-9 rounded-lg bg-white">
                <div className="h-[90px] w-36 bg-gray-200 rounded-lg mb-3 animate-pulse"></div>
                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
              </div>

              {/* Attribute Values */}
              <div className="space-y-0 flex-1 divide-y divide-gray-50">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-center h-12 lg:h-16 px-2 lg:px-4"
                  >
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export function ShowroomGridSkeleton({ grids = 3, itemsCount = 6 }) {
  return (
    <div className="flex flex-col gap-4 md:gap-4">
      {/* Tabs Header Skeleton */}
      <div className="max-md:pt-3 flex gap-2 items-center">
        <Skeleton className="h-8 w-8 md:hidden" />
        <Skeleton className="h-7 w-40 lg:h-8 lg:w-48" />
      </div>
      <div className="flex items-center gap-4 border-b mb-1 overflow-x-auto hide-scrollbar">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex py-4 px-2 lg:px-4">
            <Skeleton className="h-4 w-30 md:w-40" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[268px_1fr] gap-5">
        {/* Filters */}
        <div className="w-[268px] hidden lg:block">
          <FilterSkeleton />
        </div>
        <div className="w-full">
          <ShowroomListingsSkeleton
            grids={grids}
            itemsCount={itemsCount}
            className="border"
          />
        </div>
      </div>
    </div>
  );
}

export function CarServiceDetailsSkeleton() {
  return (
    <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-[688px_1fr] lg:gap-10">
      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-[#F0F0F0] bg-white">
        <Skeleton className="h-[177px] w-full rounded-none" />
        <div className="flex flex-1 flex-col gap-4 p-5 md:p-6">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-[200px] w-full rounded-xl" />
          <Skeleton className="h-[200px] w-full rounded-xl" />
        </div>
      </div>

      <div className="flex h-full flex-col gap-4 overflow-hidden rounded-xl border border-[#F0F0F0] bg-white p-5 md:p-6">
        <Skeleton className="h-6 w-52" />
        <Skeleton className="min-h-[200px] flex-1 w-full rounded-xl" />
        <Skeleton className="min-h-[200px] flex-1 w-full rounded-xl" />
      </div>
    </div>
  );
}
