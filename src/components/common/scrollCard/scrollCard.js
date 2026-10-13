'use client';
import { useEffect, useMemo, useState } from 'react';
import ScrollArea from '../scrollArea';
import Input from '../input/input';
import NextLink from '../nextLink';
import { useLocale, useTranslations } from 'next-intl';
import { createLocaleStringGetter, toArray } from '@/utils/general';
import FilterItemRow from '../filterItemRow/filterItemRow';
import { cn } from '@/utils';
import Spinner from '../spinner/spinner';
import { ChevronArrowBubble } from '@/icons';
import { useSearchParams, usePathname } from 'next/navigation';

export default function ScrollCard(props) {
  const locale = useLocale();
  const t = createLocaleStringGetter(locale);

  const {
    loading,
    data = [],
    style = { height: 180 },
    getOptionLabel = (e) => t(e, 'label'),
    getOptionValue = (e) => e?.slug,
    getOptionSuffix = (e) => t(e, 'count'),
    value,
    onClick,
    linkable,
    isMulti = false,
    placeholder,
    className,
    InputclassName,
    shadow = true,
    containerClassName,
    icon,
    carSelection = false,
    filterRowClass,
    scrollClassName,
    inputsuffix,
    resetState = false,
    emptyMessage,
    containerStyle,
    onFilteredEmptyChange,
    allowSearch = true,
  } = props;

  const [searchTerm, setSearchTerm] = useState('');
  const trans = useTranslations('common');
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const filteredData = useMemo(() => {
    return data?.filter((item) =>
      getOptionLabel(item)?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [data, searchTerm, getOptionLabel]);

  useEffect(() => {
    if (!onFilteredEmptyChange || loading) return;
    onFilteredEmptyChange(!filteredData?.length);
  }, [filteredData, loading, onFilteredEmptyChange]);

  const selectedValues = toArray(value);

  useEffect(() => {
    setSearchTerm('');
  }, [pathname, searchParams]);

  return (
    <div className={className} style={{ ...containerStyle }}>
      {allowSearch && (
        <Input
          type="text"
          placeholder={placeholder || trans('Search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          containerClassName={containerClassName || 'mb-2 '}
          inputClassName="w-full"
          className={cn(shadow && 'shadow', InputclassName)}
          suffix={inputsuffix}
          // autoFocus={!!data?.length || loading}
        />
      )}

      <ScrollArea
        type="always"
        scrollbars="vertical"
        style={style}
        className={cn(
          'flex flex-col space-y-1 py-2 p-1 lg:overscroll-auto',
          loading
            ? 'bg-transparent items-center'
            : 'bg-gray-50 rounded-lg shadow',
          scrollClassName,
        )}
      >
        <>
          {loading ? (
            <>
              <Spinner
                variant="ellipsis"
                className="text-center text-primary"
              />
            </>
          ) : filteredData?.length ? (
            filteredData.map((item, index) => {
              const isSelected = selectedValues.some(
                (v) => getOptionValue(v) === getOptionValue(item),
              );
              return linkable ? (
                <NextLink key={index} href={item?.url}></NextLink>
              ) : (
                <FilterItemRow
                  key={index}
                  label={getOptionLabel(item)}
                  value={getOptionSuffix(item)}
                  labelClassName="font-medium"
                  className={cn(
                    'p-2 hover:bg-muted cursor-pointer group',
                    isSelected && 'bg-primary-100 **:text-primary',
                    filterRowClass,
                  )}
                  icon={
                    icon ||
                    (carSelection && (
                      <span
                        className={cn(
                          'opacity-0 translate-x-[-4px] transition-all duration-100 ease-in-out',
                          'group-hover:opacity-100 group-hover:translate-x-0',
                        )}
                      >
                        <ChevronArrowBubble className="bg-white" />
                      </span>
                    ))
                  }
                  onClick={() => onClick(item)}
                />
              );
            })
          ) : (
            <span className="text-sm text-gray-light text-center py-1">
              {emptyMessage || trans('No options found')}
            </span>
          )}
        </>
      </ScrollArea>
    </div>
  );
}
