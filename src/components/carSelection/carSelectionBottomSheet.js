'use client';
import { useEffect, useMemo, useState } from 'react';
import DrawerWrapper from '../common/drawer';
import Button from '../common/button/button';
import ScrollCard from '../common/scrollCard/scrollCard';
import { ChevronLeftIcon } from 'lucide-react';
import { useTranslations } from 'use-intl';
import Text from '../common/text';
import TextWithIcon from '../common/textWithIcon/textWithIcon';
import { IconEmptyState } from '@/icons/basicSvgs';
import Spinner from '../common/spinner/spinner';

export default function CarSelectionBottomSheet({
  brands,
  models,
  years,
  classes,
  brandLoading,
  modelLoading,
  classLoading,
  yearLoading,
  isOpen,
  onClick,
  selectedValue,
  onClose,
  OnDoneClick,
  onEnterCarManually,
  step,
  setStep,
  steps = ['brand', 'model', 'year', 'class'],
  skipYears,
  classMandatory = false,
}) {
  const t = useTranslations('common');
  const stepConfig = {
    brand: { data: brands, loading: brandLoading, title: 'Brands' },
    model: { data: models, loading: modelLoading, title: 'Models' },
    year: { data: years, loading: yearLoading, title: 'Years' },
    class: { data: classes, loading: classLoading, title: 'Classes' },
  };
  const filteredSteps = skipYears ? steps.filter((s) => s !== 'year') : steps;

  const currentStep = useMemo(
    () => stepConfig?.[filteredSteps[step]],
    [stepConfig, step],
  );

  const [stepFilteredEmpty, setStepFilteredEmpty] = useState(false);
  const currentColumn = filteredSteps[step];
  const isBrandOrModelStep =
    currentColumn === 'brand' || currentColumn === 'model';

  useEffect(() => {
    setStepFilteredEmpty(false);
  }, [step]);

  const showEnterCarManually =
    onEnterCarManually &&
    isBrandOrModelStep &&
    !currentStep?.loading &&
    (stepFilteredEmpty ||
      (currentStep?.data && !currentStep?.data?.length));

  const renderEmptyState = () => {
    switch (filteredSteps[step]) {
      case 'class':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div>
              <TextWithIcon
                className="gap-3 mb-2"
                icon={<IconEmptyState />}
                titleClassName={'text-xs lg:text-sm'}
                title={
                  filteredSteps.includes('year')
                    ? t('No Classes available for this year')
                    : t('No Classes available for this model')
                }
              />

              <Text as="div" className="text-gray-light text-xs">
                {t(
                  'Please try adjusting your criteria or proceed without selecting a Class',
                )}
              </Text>
            </div>
          </div>
        );

      default:
        return t('No options found');
    }
  };

  const handleClick = (item) => {
    onClick(item, filteredSteps[step]);
    if (step < filteredSteps.length - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <DrawerWrapper
      isOpen={isOpen}
      title={
        <div className="relative">
          {step > 0 && (
            <div className="absolute rtl:start-3 w-auto text-start">
              <Button className="size-6 " onClick={handleBack}>
                <ChevronLeftIcon className="flipX" />
              </Button>
            </div>
          )}
          <Text className="w-full text-sm" as="h4">
            {' '}
            {t(currentStep?.title)}
          </Text>
        </div>
      }
      onClose={() => {
        setStep(0);
        onClose();
      }}
      footer={
        <div className="flex w-full gap-2">
          {showEnterCarManually && (
            <Button
              type="button"
              variant="tertiary"
              className="flex-1 rounded-lg border border-primary-500"
              onClick={onEnterCarManually}
            >
              {t('enter_car_manually')}
            </Button>
          )}
          <Button
            onClick={OnDoneClick}
            disabled={
              steps.includes('class') && classMandatory && !selectedValue?.class
            }
            className={showEnterCarManually ? 'flex-1' : 'w-full'}
          >
            {t('Done')}
          </Button>
        </div>
      }
      closeBtnClassName="!top-7"
    >
      {currentStep?.data && !currentStep?.data?.length ? (
        currentStep?.loading ? (
          <Spinner variant="ellipsis" className="text-center text-primary" />
        ) : (
          renderEmptyState()
        )
      ) : (
        <ScrollCard
          key={filteredSteps[step]}
          loading={currentStep?.loading}
          onClick={(e) => handleClick(e)}
          value={selectedValue?.[filteredSteps[step]]}
          data={currentStep?.data ?? []}
          style={{ maxHeight: 600 }}
          getOptionSuffix={() => {}}
          getOptionValue={(e) =>
            filteredSteps[step] === 'class' ? e?.id : e?.slug
          }
          scrollClassName="bg-transparent border-none shadow-none"
          filterRowClass="hover:bg-primary-50 rounded-md"
          shadow={false}
          carSelection
          {...(isBrandOrModelStep &&
            onEnterCarManually &&
            !(currentColumn === 'model' && !selectedValue?.brand) && {
              onFilteredEmptyChange: setStepFilteredEmpty,
            })}
          emptyMessage={
            currentColumn === 'model' && !selectedValue?.brand
              ? t('Please select a brand')
              : undefined
          }
        />
      )}
    </DrawerWrapper>
  );
}
