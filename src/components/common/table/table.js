import {
  Table as KitTable,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTableData } from '@/hooks/useTableData';
import { cn } from '@/utils';
import TableComponents from '.';
import Pagination from '../pagination';
import TableSkeleton from './tableSkeleton';
import { InfoIcon } from '@/icons';
import { useTranslations } from 'next-intl';

function Table({
  data = [],
  columns = [],
  caption,
  footerData,
  className,
  wrapperClassName,
  pagination = null,
  isLoading,
  locale = 'en',
  isTrans = false,
}) {
  const t = useTranslations('common');

  const tableData = useTableData(data, columns, locale);

  const renderCell = (item) => {
    const { component, props, children } = item || {};
    const Comp = TableComponents[component] || TableComponents.Default;
    return <Comp {...props}>{children}</Comp>;
  };

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full text-center py-12 text-gray-500">
        {t('No data available')}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <div
        className={cn('overflow-hidden border rounded-xl', wrapperClassName)}
      >
        <KitTable className={cn('border-collapse', className)}>
          <TableHeader className="bg-gray-50">
            <TableRow>
              {columns.map((column, index) => (
                <TableHead
                  key={column?.key || index}
                  className={cn('py-3 px-5')}
                >
                  {!isTrans ? t(column?.header) : column?.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((row, rowIndex) => (
              <TableRow
                key={row?.key || rowIndex}
                className={cn('border-t hover:bg-primary-50', row.className)}
              >
                {columns.map((column, colIndex) => (
                  <TableCell
                    key={column?.key || colIndex}
                    className={cn('py-4 px-5', column.className)}
                    {...(column?.props || {})}
                  >
                    {column.component ? (
                      row[column.key]?.isEmpty ? (
                        <div className="flex items-center gap-1 text-danger">
                          {row[column.key]?.fallbackText && (
                            <InfoIcon className="w-5 h-5" />
                          )}
                          <span>
                            {row[column.key]?.fallbackText
                              ? t(row[column.key]?.fallbackText)
                              : '-'}
                          </span>
                        </div>
                      ) : (
                        renderCell(row[column.key])
                      )
                    ) : column.render ? (
                      column.render(row[column.key], row, rowIndex)
                    ) : // to handle the lists in the tablecell
                    Array.isArray(row[column.key]?.value ?? row[column.key]) ? (
                      <ul className="list-disc ms-6">
                        {(row[column.key]?.value ?? row[column.key]).map(
                          (v, i) => (
                            <li key={i}>{String(v)}</li>
                          ),
                        )}
                      </ul>
                    ) : (
                      row[column.key]?.value ?? row[column.key]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
          {footerData && (
            <TableFooter className="bg-white">
              <TableRow>
                {footerData.map((cell, index) => (
                  <TableCell
                    key={index}
                    colSpan={cell.colSpan}
                    className={cn(cell.className || '')}
                  >
                    {cell.content}
                  </TableCell>
                ))}
              </TableRow>
            </TableFooter>
          )}
          {caption && <TableCaption>{caption}</TableCaption>}
        </KitTable>
      </div>
      {pagination && (
        <Pagination
          className="pagination-bar"
          currentPage={pagination?.current_page}
          totalCount={pagination?.total_count}
          pageSize={pagination?.page_size || 10}
          totalPages={pagination?.total_pages}
        />
      )}
    </div>
  );
}

export default Table;
