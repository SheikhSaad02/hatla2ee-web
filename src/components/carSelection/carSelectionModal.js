'use client';

import { Modal } from '@/components/common/modal';
import ScrollCard from '@/components/common/scrollCard/scrollCard';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import Text from '../common/text';
import { IconEmptyState } from '@/icons/basicSvgs';
import TextWithIcon from '../common/textWithIcon/textWithIcon';
import Spinner from '../common/spinner/spinner';
import { cn } from '@/utils';
import { useCallback, useState } from 'react';
export default function CarSelectionModal({
  brands,
  models,
  years,
  classes,
  brandLoading,
  modelLoading,
  classLoading,
  isOpen,
  onClick,
  selectedValue,
  onClose,
  OnDoneClick,
  onEnterCarManually,
  classMandatory = false,
  steps = ['brand', 'model', 'year', 'class'],
  skipYears,
}) {
  const t = useTranslations('common');

  const [emptyColumns, setEmptyColumns] = useState({
    brand: false,
    model: false,
  });

  const onFilteredEmpty = useCallback((column, isEmpty) => {
    setEmptyColumns((prev) =>
      prev[column] === isEmpty ? prev : { ...prev, [column]: isEmpty },
    );
  }, []);

  const renderClassesEmptyState = () => (
    <div className="flex flex-col">
      <Text as="h4" className="text-base text-center font-bold border-b pb-4">
        {t('Classes')}{' '}
      </Text>
      <div className="w-[312px] h-full flex items-center justify-center px-8">
        {classLoading ? (
          <Spinner
            variant="ellipsis"
            className="text-center text-primary w-[312px]"
          />
        ) : (
          <div>
            <TextWithIcon
              className="gap-3 mb-2"
              icon={<IconEmptyState />}
              titleClassName={'text-xs lg:text-sm'}
              title={t('No Classes Available')}
            />

            <Text as="div" className="text-gray-light text-xs">
              {t(
                'Please try adjusting your criteria or proceed without selecting a Class',
              )}
            </Text>
          </div>
        )}
      </div>
    </div>
  );
  const Divider = () => (
    <div className=" border-l border-primary-200  shadow-xs" />
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      footerContent={
        <div className="flex w-full justify-end gap-2">
          {onEnterCarManually &&
            (emptyColumns.brand || emptyColumns.model) &&
            !brandLoading &&
            !modelLoading && (
              <Button
                type="button"
                variant="tertiary"
                className={cn('border border-primary-500 shrink-0 w-[180px]')}
                size="xl"
                onClick={onEnterCarManually}
              >
                {t('enter_car_manually')}
              </Button>
            )}
          <Button
            onClick={OnDoneClick}
            size="xl"
            className="shrink-0 w-[180px]"
            disabled={
              steps.includes('class') && classMandatory && !selectedValue?.class
            }
          >
            {t('Done')}
          </Button>
        </div>
      }
      footerClassName="w-full items-end pt-3 px-4"
      titleContainerClass="w-full"
      containerClassName="!max-w-none min-w-max w-auto lg:gap-0 px-0 py-6"
      contentClassName=" border-b pt-0 pb-0 "
      headerClassName="pb-0"
      className="gap-0"
    >
      <div className="car-selection-modal h-full flex flex-row gap-0  min-h-[440px]">
        <div className="relative">
          <div>
            <Text
              as="h4"
              className="text-base text-center font-bold border-b pb-4 "
            >
              {t('Brands')}{' '}
            </Text>
          </div>
          <div className="flex h-full">
            <ScrollCard
              containerClassName="mb-1"
              className="pt-4 px-4"
              containerStyle={{ width: '200px' }}
              scrollClassName="bg-transparent border-none shadow-none px-0"
              filterRowClass="hover:bg-primary-50 rounded-md "
              onClick={(e) =>
                e?.slug !== selectedValue?.brand?.slug && onClick(e, 'brand')
              }
              loading={brandLoading}
              value={selectedValue?.brand}
              data={brands}
              style={{ maxHeight: 380 }}
              getOptionSuffix={() => {}}
              shadow={false}
              carSelection
              onFilteredEmptyChange={(isEmpty) =>
                onFilteredEmpty('brand', isEmpty)
              }
            />

            <Divider />
          </div>
        </div>

        <div>
          <Text
            as="h4"
            className="text-base text-center font-bold border-b pb-4"
          >
            {t('Models')}{' '}
          </Text>

          <div className="flex  h-full">
            <ScrollCard
              containerClassName="mb-1"
              className={cn(
                'pt-4 px-4',
                !selectedValue?.brand && 'opacity-50 pointer-events-none',
              )}
              containerStyle={{ width: '200px' }}
              scrollClassName="bg-transparent border-none shadow-none px-0"
              filterRowClass="hover:bg-primary-50 rounded-md"
              onClick={(e) => {
                if (!selectedValue?.brand) return;
                if (e?.slug !== selectedValue?.model?.slug) {
                  onClick(e, 'model');
                }
              }}
              {...(selectedValue?.brand && {
                onFilteredEmptyChange: (isEmpty) =>
                  onFilteredEmpty('model', isEmpty),
              })}
              loading={modelLoading}
              value={selectedValue?.model}
              data={selectedValue?.brand ? models : null}
              style={{ maxHeight: 380 }}
              getOptionSuffix={() => {}}
              shadow={false}
              carSelection
              emptyMessage={
                !selectedValue?.brand ? t('Please select a brand') : undefined
              }
            />
            <Divider />
          </div>
        </div>

        {selectedValue?.model && steps.includes('year') && !skipYears && (
          <>
            <div>
              <Text
                as="h4"
                className="text-base text-center font-bold border-b pb-4"
              >
                {t('Years')}{' '}
              </Text>

              <div className="flex h-full ">
                <ScrollCard
                  containerClassName="mb-1"
                  className="pt-4 px-4 "
                  containerStyle={{ width: '200px' }}
                  scrollClassName="bg-transparent border-none shadow-none px-0"
                  filterRowClass="hover:bg-primary-50 rounded-md"
                  onClick={(e) =>
                    e?.slug !== selectedValue?.year?.slug && onClick(e, 'year')
                  }
                  value={selectedValue?.year}
                  data={years}
                  style={{ maxHeight: 380 }}
                  getOptionSuffix={() => {}}
                  shadow={false}
                  carSelection
                />
                <Divider />
              </div>
            </div>
          </>
        )}
        {(!skipYears ? selectedValue?.year : selectedValue?.model) &&
          steps.includes('class') && (
            <>
              {classes && !classes?.length ? (
                renderClassesEmptyState()
              ) : (
                <div>
                  <Text
                    as="h4"
                    className="text-base text-center font-bold border-b pb-4"
                  >
                    {t('Classes')}{' '}
                  </Text>
                  <div className="flex flex-col">
                    <ScrollCard
                      containerClassName="mb-1"
                      className="pt-4 px-4"
                      containerStyle={{ width: '280px' }}
                      scrollClassName="bg-transparent border-none shadow-none px-0"
                      filterRowClass="hover:bg-primary-50 rounded-md"
                      onClick={(e) => {
                        e?.slug !== selectedValue?.class?.slug &&
                          onClick(e, 'class');
                      }}
                      loading={classLoading}
                      value={selectedValue?.class}
                      data={classes}
                      style={{ maxHeight: 380 }}
                      getOptionSuffix={() => {}}
                      shadow={false}
                      carSelection
                      getOptionValue={(e) => e?.id}
                    />

                    <Divider />
                  </div>
                </div>
              )}
            </>
          )}
      </div>
    </Modal>
  );
}
