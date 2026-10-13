'use client';

import {
  Pagination as KitPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import { usePagination } from '@/hooks/usePagination';
import { usePathname } from '@/i18n/navigation';
import { cn } from '@/utils';
import { useCallback } from 'react';
import { twMerge } from 'tailwind-merge';
import { useSearchParams } from 'next/navigation';
import { createPaginationWithQueryParams } from '@/utils/used-cars/listings';

export default function Pagination(props) {
  const {
    totalCount,
    siblingCount = 1,
    currentPage = 1,
    pageSize,
    totalPages,
    className,
    generateLink,
    useQuery = false,
  } = props;
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const defaultGenerateLink = useCallback(
    (page) => {
      if (useQuery) {
        return createPaginationWithQueryParams(pathname, searchParams, page);
      }
      const basePath = pathname
        .replace(/\/page\/\d+$/, '')
        .replace(/\?[^]*$/, '');
      const query = searchParams.size ? `?${searchParams}` : '';

      return page === 1
        ? `${basePath}${query}`
        : `${basePath}/page/${page}${query}`;
    },
    [pathname, useQuery, searchParams],
  );

  const getLink = generateLink || defaultGenerateLink;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
    totalPages,
  });

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  let lastPage = paginationRange[paginationRange.length - 1];

  const renderNavItem = (pageNum, disabled, icon) => {
    const baseClasses = twMerge(
      'min-w-8 md:min-w-10 h-8 md:h-10 bg-primary-50 text-sm border border-primary-200 text-primary-800 hover:bg-primary-200 hover:text-primary flex items-center justify-center rounded-md transition-colors',
      disabled
        ? 'pointer-events-none text-gray-400 bg-transparent border-gray-100'
        : undefined,
    );

    return (
      <PaginationLink href={getLink(pageNum)} className={baseClasses}>
        {icon}
      </PaginationLink>
    );
  };

  const renderPageItem = (pageNumber) => {
    const isActive = pageNumber === currentPage;

    return (
      <PaginationLink
        href={getLink(pageNumber)}
        aria-current={isActive ? 'page' : undefined}
        data-slot="pagination-link"
        data-active={isActive}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          'h-8 md:h-10 w-8 md:w-10',
          isActive
            ? 'bg-primary text-white pointer-events-none'
            : 'border text-gray-500 hover:text-accent-foreground',
        )}
      >
        {pageNumber}
      </PaginationLink>
    );
  };

  return (
    <div className="">
      <KitPagination className={cn({ className })}>
        <PaginationContent className="gap-1 md:gap-3">
          <PaginationItem>
            {renderNavItem(
              currentPage - 1,
              currentPage === 1,
              <ChevronLeftIcon className="w-8 md:w-10 h-8 md:h-10 flipX" />,
            )}
          </PaginationItem>

          {paginationRange.map((pageNumber, index) => {
            if (pageNumber === 'DOTS') {
              return <PaginationEllipsis key={`${pageNumber}-${index}`} />;
            }

            return (
              <PaginationItem key={pageNumber}>
                {renderPageItem(pageNumber)}
              </PaginationItem>
            );
          })}

          <PaginationItem>
            {renderNavItem(
              currentPage + 1,
              currentPage === lastPage,
              <ChevronRightIcon className="w-8 md:w-10 h-8 md:h-10 flipX" />,
            )}
          </PaginationItem>
        </PaginationContent>
      </KitPagination>
    </div>
  );
}
