import { listingJumpLinks } from '@/data/detail';
import { cn } from '@/utils';
import { getLocaleStringServer, isMobileServer } from '@/utils/serverFunctions';
import Text from '../text';
import NextLink from '../nextLink';
import { formatDate } from '@/utils/date';
import { getLocale, getTranslations } from 'next-intl/server';

async function SpecificationGrid({
  title = 'Specifications',
  data,
  headerSlot = null,
}) {
  const mid = Math.ceil(data?.length / 2);
  const isMobile = await isMobileServer();
  const columns = isMobile ? [data] : [data?.slice(0, mid), data?.slice(mid)];
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'common' });

  const processedColumns = await Promise.all(
    columns?.map(async (items) => {
      const processedItems = await Promise.all(
        items?.map(async (item) => {
          const rawValue = await getLocaleStringServer(item, 'value');
          const label = await getLocaleStringServer(item, 'label', t);
          const displayValue =
            (item?.slug === 'posted_at' || item?.slug === 'updated_at') &&
            item?.value
              ? formatDate(item.value, undefined, locale)
              : rawValue;

          return {
            ...item,
            processedLabel: label,
            processedValue: displayValue,
          };
        }),
      );

      return processedItems.filter(
        (processedItem) => processedItem.processedValue != null,
      );
    }),
  );

  return (
    data?.length > 0 && (
      <div id={listingJumpLinks.CAR_DETAILS} className="flex flex-col w-full ">
        <Text as="h2" className="sectionHeading">
          {title}
        </Text>

        {headerSlot ? <div className="mb-6">{headerSlot}</div> : null}

        <div
          className={cn(
            'grid gap-6 text-xs md:text-sm',
            !isMobile && 'md:grid-cols-2',
          )}
        >
          {processedColumns?.map((items, col) => (
            <div key={col}>
              {items?.map((item, index) => {
                const isFirst = index === 0;
                const isLast = index === items.length - 1;

                return (
                  <div key={index} className="flex -mt-[1px]">
                    <div
                      className={cn(
                        'text-muted-foreground border border-gray-50 bg-primary-50 py-2 px-3 md:py-[10] w-full flex items-center',
                        isFirst && 'ltr:rounded-tl-lg rtl:rounded-tr-lg',
                        isLast && 'ltr:rounded-bl-lg rtl:rounded-br-lg',
                      )}
                    >
                      {item.processedLabel}
                    </div>
                    <div
                      className={cn(
                        'font-medium border border-gray-100 py-2 px-3 md:py-[10] w-full flex items-center',
                        isFirst && 'ltr:rounded-tr-lg rtl:rounded-tl-lg',
                        isLast && 'ltr:rounded-br-lg rtl:rounded-bl-lg',
                      )}
                    >
                      {item?.href ? (
                        <NextLink
                          href={item?.href}
                          title={item.processedValue}
                          className={cn('text-sm text-gray-700 underline')}
                        >
                          {item.processedValue}
                        </NextLink>
                      ) : (
                        item.processedValue
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    )
  );
}

export default SpecificationGrid;
