'use client';

import { createLocaleStringGetter, toArray } from '@/utils/general';
import { useIsMobile } from '@/providers/isMobile';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useLocale, useTranslations } from 'next-intl';

import DrawerWrapper from '../drawer';
import Input from '../input/input';
import Popover from '../popover';
import Button from '../button/button';
import { Search } from 'lucide-react';
import SearchDropdownContent from './selectContent';
import { cn } from '@/utils';
import { useDebouncedCallback } from 'use-debounce';

const DEBOUNCE_DELAY = 300;
const FOCUS_PREVENT_DELAY = 180;

const Select = forwardRef((props, ref) => {
  const locale = useLocale();
  const trans = useTranslations('common');
  const t = createLocaleStringGetter(locale);

  const {
    defaultOptions = [],
    defaultValue = null,
    loadOptions = null,
    onSelect = () => {},
    onOpen = () => {},
    placeholder = trans('Search'),
    noOptionsMessage = trans('No options found'),
    loadingMessage = trans('Loading'),
    getOptionLabel = (e) => t(e, 'label'),
    getOptionSuffix = (e) => t(e, 'count'),
    getOptionValue = (option) => option?.value,
    initialContent = null,
    containerClassName,
    allowSearch = true,
    triggerProps = {},
    title,
    bottomContent,
    value,
    renderOption,
    loading = false,
    errorMsg,
    showError,
    fullScreen = true,
    renderExternalTrigger,
    zIndex,
    selectOptionOnEnter,
    enableKeyboardNavigation = false,
    isMulti = false,
    popoverProps = {},
    maxLength,
  } = props;

  const isMob = useIsMobile() ?? false;
  const [query, setQuery] = useState(
    defaultValue ? getOptionLabel(defaultValue) : '',
  );
  const [mobileQuery, setMobileQuery] = useState('');
  const [selectedValue, setSelectedValue] = useState(
    defaultValue ? defaultValue : '',
  );
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState(defaultOptions);
  const [isLoading, setIsLoading] = useState(false);
  const onOpenCalledRef = useRef(false);
  const [shouldAutoSelectOnLoad, setShouldAutoSelectOnLoad] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const triggerInputRef = useRef(null);
  const shouldPreventFocus = useRef(false);
  const focusTimeoutRef = useRef(null);
  const optionsContainerRef = useRef(null);
  const optionRefs = useRef([]);
  // Track the query that was used to fetch current options
  const optionsQueryRef = useRef('');

  const currentQuery = useMemo(
    () => (isMob ? mobileQuery : query),
    [isMob, mobileQuery, query],
  );

  const getCurrentQuery = useCallback(
    () => currentQuery.trim(),
    [currentQuery],
  );

  const areOptionsReady = useCallback(() => {
    const trimmedQuery = getCurrentQuery();
    return (
      options?.length > 0 &&
      !isLoading &&
      !loading &&
      optionsQueryRef.current === trimmedQuery
    );
  }, [options, isLoading, loading, getCurrentQuery]);

  useImperativeHandle(ref, () => ({
    focus: () => focusInput(),
  }));

  const focusInput = useCallback(() => {
    if (triggerInputRef.current) {
      const inputElement = triggerInputRef.current.querySelector('input');
      if (inputElement) {
        inputElement.focus();
        setIsOpen(true);
      }
    }
  }, []);

  useEffect(() => {
    if (defaultOptions?.length) {
      setOptions(defaultOptions);
      optionsQueryRef.current = '';
    }
  }, [defaultOptions]);

  useEffect(() => {
    // if (value !== undefined) {
    setSelectedValue(value);
    if (!isMulti) {
      setQuery(getOptionLabel(value) || '');
    }
    // }
  }, [value, isMulti]);

  const getMultiDisplayValue = () =>
    toArray(value).map(getOptionLabel).filter(Boolean).join(', ') || '';

  // Reset highlighted index when options change
  useEffect(() => {
    setHighlightedIndex(-1);
    optionRefs.current = [];
  }, [options]);

  const filterLocalOptions = useCallback(
    (searchQuery) => {
      const trimmedQuery = searchQuery.trim();
      if (!trimmedQuery) {
        return defaultOptions;
      }
      const lowerSearch = trimmedQuery.toLowerCase();
      const startsWithMatches = defaultOptions.filter((option) =>
        getOptionLabel(option).toLowerCase().startsWith(lowerSearch),
      );
      const includesMatches = defaultOptions.filter((option) => {
        const label = getOptionLabel(option).toLowerCase();
        return label.includes(lowerSearch) && !label.startsWith(lowerSearch);
      });

      return [...startsWithMatches, ...includesMatches];
    },
    [defaultOptions, getOptionLabel],
  );

  const debouncedAsyncSearch = useDebouncedCallback(async (searchQuery) => {
    if (!loadOptions) return;

    const trimmedQuery = searchQuery.trim();
    setIsLoading(true);
    try {
      const results = await loadOptions(trimmedQuery);
      const currentQueryTrimmed = getCurrentQuery();
      if (trimmedQuery === currentQueryTrimmed) {
        setOptions(results || []);
        optionsQueryRef.current = trimmedQuery;

        if (shouldAutoSelectOnLoad && results?.length > 0) {
          setShouldAutoSelectOnLoad(false);
          handleOptionSelect(results[0]);
        } else if (shouldAutoSelectOnLoad) {
          setShouldAutoSelectOnLoad(false);
        }
      }
    } catch (error) {
      console.error('Error loading options:', error);
      const currentQueryTrimmed = getCurrentQuery();
      if (trimmedQuery === currentQueryTrimmed) {
        setOptions([]);
        optionsQueryRef.current = trimmedQuery;
      }
      setShouldAutoSelectOnLoad(false);
    } finally {
      setIsLoading(false);
    }
  }, DEBOUNCE_DELAY);

  useEffect(() => {
    return () => {
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current);
      }
      debouncedAsyncSearch.cancel();
    };
  }, [debouncedAsyncSearch]);

  const handleInputChange = useCallback(
    (e) => {
      const value = e.target.value;

      if (isMob) {
        setMobileQuery(value);
      } else {
        setQuery(value);
      }

      setShouldAutoSelectOnLoad(false);
      setHighlightedIndex(-1);

      if (!isOpen) {
        setIsOpen(true);
      }

      if (loadOptions) {
        if (value.trim()) {
          debouncedAsyncSearch(value);
        } else {
          setOptions(defaultOptions);
          optionsQueryRef.current = '';
          setIsLoading(false);
        }
      } else {
        const filteredOptions = filterLocalOptions(value);
        setOptions(filteredOptions);
        optionsQueryRef.current = value.trim();
      }
    },
    [
      isMob,
      isOpen,
      loadOptions,
      defaultOptions,
      debouncedAsyncSearch,
      filterLocalOptions,
    ],
  );

  const handleInputBlur = useCallback(() => {
    if (!isOpen) {
      setQuery(getOptionLabel(selectedValue) || query || '');
    }
  }, [isOpen, selectedValue, query, getOptionLabel]);

  const handleOptionSelect = useCallback(
    (selectedOption) => {
      if (isMulti) {
        onSelect(selectedOption, getCurrentQuery());
        return;
      }
      const selectedLabel = getOptionLabel(selectedOption);
      const searchQuery = getCurrentQuery();
      setQuery(selectedLabel);
      setMobileQuery('');
      setSelectedValue(selectedOption);
      onSelect(selectedOption, searchQuery);
      setIsOpen(false);

      shouldPreventFocus.current = true;
      // Clear any existing timeout
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current);
      }
      focusTimeoutRef.current = setTimeout(() => {
        shouldPreventFocus.current = false;
        focusTimeoutRef.current = null;
      }, FOCUS_PREVENT_DELAY);
    },
    [getOptionLabel, onSelect, getCurrentQuery, isMulti],
  );

  const handleClose = useCallback(
    (newIsOpen) => {
      setIsOpen(newIsOpen);
      if (!newIsOpen) {
        setQuery(getOptionLabel(selectedValue) || query || '');
        setHighlightedIndex(-1);
        onOpenCalledRef.current = false;
      }
    },
    [selectedValue, query, getOptionLabel],
  );

  const handleOpen = useCallback(
    (e) => {
      if (isMob || !allowSearch) {
        e.preventDefault();
        e.target.blur();
      }
      setIsOpen(true);
      if (!options?.length) {
        setOptions(defaultOptions);
      }
      if (!onOpenCalledRef.current) {
        onOpenCalledRef.current = true;
        onOpen();
      }
    },
    [isMob, allowSearch, options, defaultOptions, onOpen],
  );

  const handleTriggerFocus = useCallback(
    (e) => {
      if (shouldPreventFocus.current || isMob || !allowSearch) {
        e.target.blur();
        return;
      }

      if (!onOpenCalledRef.current && allowSearch) {
        onOpenCalledRef.current = true;
        onOpen();
      }
    },
    [isMob, allowSearch, onOpen],
  );

  // Scroll highlighted option into view
  const scrollToHighlighted = useCallback((index) => {
    // Use setTimeout to ensure DOM is updated
    setTimeout(() => {
      if (optionRefs.current?.[index] && optionsContainerRef.current) {
        const optionElement = optionRefs.current[index];
        const container = optionsContainerRef.current;

        if (!optionElement || !container) return;

        const optionTop = optionElement.offsetTop;
        const optionBottom = optionTop + optionElement.offsetHeight;
        const containerTop = container.scrollTop;
        const containerBottom = containerTop + container.clientHeight;

        if (optionTop < containerTop) {
          container.scrollTop = optionTop - 8; // Add small padding
        } else if (optionBottom > containerBottom) {
          container.scrollTop = optionBottom - container.clientHeight + 8; // Add small padding
        }
      }
    }, 0);
  }, []);

  const handleKeyDown = useCallback(
    (event) => {
      if (isMob) {
        return;
      }

      const { key } = event;
      const trimmedQuery = getCurrentQuery();
      const availableOptions = options?.length > 0 ? options : [];

      // Handle Arrow Down - only if keyboard navigation is enabled
      if (key === 'ArrowDown' && enableKeyboardNavigation) {
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        if (availableOptions.length > 0) {
          const newIndex =
            highlightedIndex < availableOptions.length - 1
              ? highlightedIndex + 1
              : 0;
          setHighlightedIndex(newIndex);
          scrollToHighlighted(newIndex);
        }
        return;
      }

      // Handle Arrow Up - only if keyboard navigation is enabled
      if (key === 'ArrowUp' && enableKeyboardNavigation) {
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        if (availableOptions.length > 0) {
          const newIndex =
            highlightedIndex > 0
              ? highlightedIndex - 1
              : availableOptions.length - 1;
          setHighlightedIndex(newIndex);
          scrollToHighlighted(newIndex);
        }
        return;
      }

      if (key === 'Enter') {
        event.preventDefault();

        if (!isOpen) {
          setIsOpen(true);
        }

        // If keyboard navigation is enabled and an option is highlighted, select it
        if (
          enableKeyboardNavigation &&
          highlightedIndex >= 0 &&
          highlightedIndex < availableOptions.length
        ) {
          handleOptionSelect(availableOptions[highlightedIndex]);
          return;
        }

        // If selectOptionOnEnter is enabled, use existing logic
        if (!selectOptionOnEnter) {
          return;
        }

        if (areOptionsReady()) {
          handleOptionSelect(availableOptions[0]);
          return;
        }

        // Case 2: Async search - wait for results that match current query
        if (loadOptions && trimmedQuery) {
          // Cancel any pending debounced calls to avoid stale results
          debouncedAsyncSearch.cancel();

          // Cancel any pending auto-select for different query
          if (optionsQueryRef.current !== trimmedQuery) {
            setShouldAutoSelectOnLoad(false);
          }

          // Set flag to auto-select when current query's results load
          setShouldAutoSelectOnLoad(true);

          // Trigger search immediately with current query (not the last debounced one)
          debouncedAsyncSearch(trimmedQuery);
          return;
        }

        // Case 3: Local filtering - filter and select first option
        if (!loadOptions && trimmedQuery) {
          const filteredOptions = filterLocalOptions(trimmedQuery);
          if (filteredOptions?.length > 0) {
            optionsQueryRef.current = trimmedQuery;
            handleOptionSelect(filteredOptions[0]);
          }
          return;
        }

        // Case 4: Empty query - select from default options if available
        if (
          !trimmedQuery &&
          availableOptions.length > 0 &&
          optionsQueryRef.current === ''
        ) {
          handleOptionSelect(availableOptions[0]);
        }
      }
    },
    [
      isMob,
      enableKeyboardNavigation,
      isOpen,
      highlightedIndex,
      options,
      getCurrentQuery,
      scrollToHighlighted,
      handleOptionSelect,
      selectOptionOnEnter,
      areOptionsReady,
      loadOptions,
      debouncedAsyncSearch,
      filterLocalOptions,
    ],
  );

  const getSearchContent = useCallback(
    () => (
      <SearchDropdownContent
        query={currentQuery}
        options={options}
        isLoading={loading || isLoading}
        onSelect={handleOptionSelect}
        initialContent={initialContent}
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
        containerRef={optionsContainerRef}
      />
    ),
    [
      currentQuery,
      options,
      loading,
      isLoading,
      handleOptionSelect,
      initialContent,
      loadingMessage,
      noOptionsMessage,
      bottomContent,
      selectedValue,
      getOptionValue,
      getOptionLabel,
      renderOption,
      getOptionSuffix,
      highlightedIndex,
    ],
  );

  const renderInputTrigger = () => {
    const { className: inputClassName, ...inputRest } = triggerProps || {};

    const externalTriggerProps = {
      onClick: handleOpen,
    };
    return renderExternalTrigger ? (
      renderExternalTrigger(externalTriggerProps)
    ) : (
      <div>
        <Input
          ref={triggerInputRef}
          type="text"
          className={cn(
            'bg-white',
            !allowSearch && 'cursor-pointer',
            inputClassName,
          )}
          inputClassName={cn(!allowSearch && 'cursor-pointer')}
          placeholder={placeholder}
          value={
            isMulti
              ? getMultiDisplayValue()
              : isMob
                ? getOptionLabel(selectedValue) || ''
                : query
          }
          onChange={!isMob && allowSearch ? handleInputChange : undefined}
          onBlur={handleInputBlur}
          onClick={handleOpen}
          onFocus={handleTriggerFocus}
          onKeyDown={handleKeyDown}
          readOnly={isMob || !allowSearch}
          maxLength={maxLength}
          {...inputRest}
          errorMsg={errorMsg}
          showError={showError}
        />
        {/* {errorMsg && <p className="text-red-500 text-sm mt-1">{errorMsg}</p>} */}
      </div>
    );
  };

  return (
    <div className={cn('relative w-full', containerClassName)}>
      {!isMob ? (
        <Popover
          trigger={renderInputTrigger()}
          align="start"
          side="bottom"
          className="max-h-[300px]"
          isOpen={isOpen}
          onClose={handleClose}
          zIndex={zIndex}
          {...popoverProps}
        >
          {getSearchContent()}
        </Popover>
      ) : (
        <DrawerWrapper
          fullScreen={fullScreen}
          trigger={renderInputTrigger()}
          isOpen={isOpen}
          onClose={handleClose}
          title={title}
          footer={
            isMulti ? (
              <Button
                size="lg"
                className="w-full"
                onClick={() => handleClose(false)}
              >
                {trans('Apply')}
              </Button>
            ) : undefined
          }
          // containerClassName="max-h-[80dvh]"
        >
          {allowSearch && (
            <Input
              type="text"
              placeholder={`${trans('Type to refine your search')}`}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              maxLength={maxLength}
              suffix={<Search className="text-primary" size={16} />}
              size={isMob && 'small'}
              inputClassName="text-sm"
              containerClassName="sticky top-0 pt-4 bg-white translate-y-[-16px] -mb-4"
            />
          )}

          <div className={cn(allowSearch && 'mt-2')}>{getSearchContent()}</div>
        </DrawerWrapper>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
