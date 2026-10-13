'use client';
import { useEffect, useState, useCallback, useMemo } from 'react';
import RangeInput from '@/components/common/rangeInput';
import Button from '@/components/common/button/button';
import { Slider } from '@/components/ui/slider';
import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import DrawerWrapper from '@/components/common/drawer';

/*
The value should be of the format {min:<value>, max:<value>}
This Component has 2 behaviours based on the prop (showGoButton):
1. Uncontrolled State (showGoButton=true): used for use in config based filters (e.g filterClient) where we only need the applied value once the user presses the Go Button
2. Controlled State (showGoButton=false): used for filters where value is needed for every onChange (landing filters), where the filter state value is controlled by a global state object.

The UI only includes Go Button for desktops, so for desktops it will be uncontrolled and for mobile it will be controlled
*/
export default function FilterRange({
  value,
  onChange,
  isMobile,
  showReset = false,
  showGoButton = isMobile ? false : true,
  showSlider = true,
  min = 0,
  max = 100,
  step = 100000,
  formatValue = true,
  inputProps = {},
  renderExternalTrigger,
  title,
  belowContent = null,
  ...rest
}) {
  const t = useTranslations('common');
  const [isOpen, setIsOpen] = useState(false);
  const normalizedValue = useMemo(
    () => ({
      min: value?.min ?? null,
      max: value?.max ?? null,
    }),
    [value?.min, value?.max],
  );

  const [values, setValues] = useState(() => [
    normalizedValue.min ?? '',
    normalizedValue.max ?? '',
  ]);

  const cleanseInput = useCallback(
    (inputValues) => {
      let [min, max] = inputValues;

      if (showGoButton && min && max && min > max) {
        [min, max] = [max, min];
      }

      return { min, max };
    },
    [showGoButton],
  );

  const handleInputChange = useCallback(
    (newValues) => {
      setValues(newValues);
    },
    [],
  );

  const handleGoClick = useCallback(() => {
    onChange(cleanseInput(values));
  }, [onChange, cleanseInput, values]);

  const isButtonDisabled = (() => {
    const cleansed = cleanseInput(values);
    const { min, max } = cleansed;
    const { min: prevMin, max: prevMax } = normalizedValue;

    const currentEmpty =
      (min === '' || min == null) && (max === '' || max == null);
    const prevEmpty =
      (prevMin == null || prevMin === '') &&
      (prevMax == null || prevMax === '');

    return currentEmpty && prevEmpty;
  })();

  const handleReset = useCallback(() => {
    setValues(['', '']);

    // In controlled mode, also reset the parent
    if (!showGoButton) {
      onChange({ min: '', max: '' });
    }
  }, [showGoButton, onChange]);

  useEffect(() => {
    if (normalizedValue) {
      setValues(() => [normalizedValue.min ?? '', normalizedValue.max ?? '']);
    }
  }, [normalizedValue]);

  // Sync local state with prop changes (controlled mode only)
  useEffect(() => {
    if (!showGoButton) {
      setValues([normalizedValue.min ?? '', normalizedValue.max ?? '']);
    }
  }, [showGoButton, normalizedValue.min, normalizedValue.max]);

  // Handle prop changes for uncontrolled mode
  useEffect(() => {
    if (showGoButton) {
      // Reset local state when both values are null/undefined
      if (normalizedValue.min == null && normalizedValue.max == null) {
        setValues(['', '']);
      }
      // Update local state when both values are present
      else if (normalizedValue.min != null && normalizedValue.max != null) {
        setValues([normalizedValue.min, normalizedValue.max]);
      }
    }
  }, [showGoButton, normalizedValue.min, normalizedValue.max]);

  const handleKeyDown = useCallback(
    (e) => {
      if (showGoButton && e.key === 'Enter') {
        handleGoClick();
      } else if (!showGoButton && e.key === 'Enter') {
        onChange(cleanseInput(values));
      }
    },
    [showGoButton, handleGoClick, onChange, cleanseInput, values],
  );

  const handleInputBlur = useCallback(() => {
    if (!showGoButton && !renderExternalTrigger) {
      onChange(cleanseInput(values));
    }
  }, [showGoButton, renderExternalTrigger, onChange, cleanseInput, values]);

  const handleSliderChange = useCallback(
    (sliderValues) => {
      const [sliderMin, sliderMax] = sliderValues;
      setValues([sliderMin, sliderMax]);
    },
    [],
  );

  const handleSliderCommit = useCallback(
    (sliderValues) => {
      const [sliderMin, sliderMax] = sliderValues;
      setValues([sliderMin, sliderMax]);

      if (!showGoButton && !renderExternalTrigger) {
        onChange({ min: sliderMin, max: sliderMax });
      }
    },
    [showGoButton, onChange, renderExternalTrigger],
  );

  // Get slider values - ensure they are within bounds
  const sliderValues = useMemo(() => {
    const minVal =
      values[0] === '' || values[0] == null ? min : Number(values[0]);
    const maxVal =
      values[1] === '' || values[1] == null ? max : Number(values[1]);
    return [
      Math.max(min, Math.min(max, minVal)),
      Math.max(min, Math.min(max, maxVal)),
    ];
  }, [values, min, max]);

  const content = (
    <div className="flex flex-col w-full gap-2">
      {showReset && (
        <Button variant="link" className="px-1" onClick={handleReset}>
          {t('Reset')}
        </Button>
      )}
      {showSlider && (
        <div className="py-2">
          <Slider
            value={sliderValues}
            min={min}
            max={max}
            step={step}
            onValueChange={handleSliderChange}
            onValueCommit={handleSliderCommit}
            className="w-full"
          />
        </div>
      )}

      <div className="flex justify-center items-center gap-2">
        <RangeInput
          value={values}
          onChange={handleInputChange}
          min={min}
          max={max}
          formatValue={formatValue}
          inputProps={{
            size: 'small',
            className: 'px-2',
            inputMode: 'numeric',
            onKeyDown: handleKeyDown,
            onBlur: handleInputBlur,
            ...inputProps,
          }}
          className="w-full"
          {...rest}
        />

        {showGoButton && (
          <Button
            variant="primaryLight"
            onClick={handleGoClick}
            icon={<ChevronRight className="flipX" />}
            className="h-10 w-8"
            disabled={isButtonDisabled}
          />
        )}
      </div>

      {belowContent}
    </div>
  );

  if (renderExternalTrigger) {
    return (
      <DrawerWrapper
        trigger={renderExternalTrigger({ onClick: () => setIsOpen(true) })}
        isOpen={isOpen}
        onClose={setIsOpen}
        title={title}
        fullScreen={false}
        footer={
          <div className="flex justify-between w-full">
            <Button
              size="lg"
              variant="ghost"
              className="flex-1 text-gray-500"
              onClick={() => {
                handleReset();
                setIsOpen(false);
              }}
            >
              {t('Reset')}
            </Button>
            <Button
              size="lg"
              className="flex-1"
              onClick={() => {
                onChange(cleanseInput(values));
                setIsOpen(false);
              }}
            >
              {t('Apply')}
            </Button>
          </div>
        }
      >
        {content}
      </DrawerWrapper>
    );
  }

  return content;
}
