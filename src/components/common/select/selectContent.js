import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/utils';
import { toArray } from '@/utils/general';
import Spinner from '../spinner/spinner';

export default function SearchDropdownContent({
  query,
  options = [],
  isLoading = false,
  onSelect,
  initialContent = null,
  loadingMessage = 'Loading...',
  noOptionsMessage = 'No options found',
  bottomContent,
  selectedValue,
  getOptionValue,
  getOptionLabel,
  renderOption,
  getOptionSuffix,
  highlightedIndex = -1,
  optionRefs,
  containerRef,
}) {
  if (query.trim() || !initialContent) {
    return (
      <div ref={containerRef}>
        <SearchResultsView
          options={options}
          isLoading={isLoading}
          onSelect={onSelect}
          loadingMessage={loadingMessage}
          noOptionsMessage={noOptionsMessage}
          bottomContent={bottomContent}
          selectedValue={selectedValue}
          getOptionValue={getOptionValue}
          getOptionLabel={getOptionLabel}
          renderOption={renderOption}
          getOptionSuffix={getOptionSuffix}
          highlightedIndex={highlightedIndex}
          optionRefs={optionRefs}
        />
      </div>
    );
  }

  return initialContent;
}

function SearchResultsView({
  options,
  isLoading,
  onSelect,
  loadingMessage,
  noOptionsMessage,
  renderOption,
  bottomContent,
  selectedValue,
  getOptionValue,
  getOptionLabel,
  getOptionSuffix,
  highlightedIndex = -1,
  optionRefs,
}) {
  const selectedValues = toArray(selectedValue);
  return (
    <div className="py-2 md:py-0">
      {isLoading ? (
        <div className="flex justify-center py-4">
          <Spinner variant="ellipsis" className="text-center text-primary" />
        </div>
      ) : (
        <>
          {options.length > 0 &&
            options.map((item, index) => {
              const isSelected = selectedValues.some(
                (v) => getOptionValue(v) === getOptionValue(item),
              );
              const isHighlighted = highlightedIndex === index;
              return (
                <div
                  key={item.id || index}
                  ref={(el) => {
                    if (optionRefs) {
                      optionRefs.current[index] = el;
                    }
                  }}
                  className={cn(
                    'mb-1 last:border-b-0 hover:bg-primary-50',
                    isSelected
                      ? 'bg-primary-50 border-0 rounded-[6px]'
                      : 'border-b border-b-gray-50',
                    isHighlighted && !isSelected && 'bg-primary-100',
                  )}
                >
                  <div
                    className="w-full flex justify-between items-center p-2.5 cursor-pointer"
                    onClick={() => onSelect(item)}
                  >
                    {renderOption ? (
                      renderOption({ option: item, isSelected, isHighlighted })
                    ) : (
                      <div className="flex justify-between items-center w-full">
                        <span
                          className={cn(
                            'font-medium text-sm',
                            (isSelected || isHighlighted) &&
                              'text-primary font-bold',
                          )}
                        >
                          {getOptionLabel(item)}
                        </span>
                        <span
                          className={cn(
                            'text-gray-light text-sm',
                            (isSelected || isHighlighted) &&
                              'text-primary font-bold',
                          )}
                        >
                          {getOptionSuffix(item)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

          {!isLoading && options.length === 0 && (
            <div className="px-4 py-3 text-gray-500 text-center">
              {noOptionsMessage}
            </div>
          )}
        </>
      )}
      {bottomContent && <div>{bottomContent}</div>}
    </div>
  );
}
