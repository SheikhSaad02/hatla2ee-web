'use client';
import { appPaths } from '@/constants';
import { showToast } from '@/utils/notification-service';
import { Plus } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import React, { useEffect, useRef, useState } from 'react';
import CarSelectionCard from '../carSelection/carSelectionCard';
import { Breadcrumbs } from '../common/breadcrumbs';
import Button from '../common/button/button';
import CarouselSection from '../common/carouselSection/carouselSection';
import { useIsMobile } from '@/providers/isMobile';
import { PAGE_SECTIONS } from '@/services/analyticsService/constants';
import { cn } from '@/utils';
const CompareHeroSection = ({
  isMobile: isMobileProp,
  vehicleCategorySlug,
}) => {
  const [selectedCars, setSelectedCars] = useState([null, null, null]);
  const [carErrors, setCarErrors] = useState([false, false, false]);
  const [carouselApi, setCarouselApi] = useState(null);
  const timeoutRef = useRef(null);
  const t = useTranslations('common');
  const isMobileFromContext = useIsMobile();
  const isMob = isMobileProp ?? isMobileFromContext ?? false;
  const maxCars = 4;

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getBreadcrumbsList = () => {
    return [{ label: t('Home'), href: '/' }, { label: t('Car Comparison') }];
  };

  const handleCarSelect = (car, index) => {
    if (selectedCars.some((c) => c?.listingId === car?.listingId)) {
      showToast('error', 'Car already in comparison');
      // Set error state for this card
      setCarErrors((prev) => {
        const newErrors = [...prev];
        newErrors[index] = true;
        return newErrors;
      });
      return;
    }

    // Clear any error state for this card
    setCarErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = false;
      return newErrors;
    });

    setSelectedCars((prev) => {
      const newCars = [...prev];
      newCars[index] = car;
      return newCars;
    });

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // For mobile carousel, advance to next slide after a delay
    if (isMob && carouselApi) {
      timeoutRef.current = setTimeout(() => {
        // Check if there's a next slide available
        if (carouselApi.canScrollNext()) {
          carouselApi.scrollNext();
        }
        timeoutRef.current = null;
      }, 1000); // 1 second delay
    }
  };

  const handleCarRemove = (index) => {
    setSelectedCars((prev) => {
      const newCars = [...prev];
      newCars[index] = null; // Set to null instead of removing
      return newCars;
    });

    // Clear error state when removing car
    setCarErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = false;
      return newErrors;
    });
  };

  const handleAddCar = () => {
    if (selectedCars.length < maxCars) {
      setSelectedCars((prev) => [...prev, null]);
      setCarErrors((prev) => [...prev, false]);
    }
  };

  const getTerazesUrl = () => {
    const validCars = selectedCars.filter((car) => car !== null);

    if (validCars.length === 0) {
      // Return terazes page if no cars selected
      return appPaths[`new-${vehicleCategorySlug}-compare-terazes`];
    }

    const carIds = validCars.map((car) => car.listingId).filter(Boolean);

    if (carIds.length > 0) {
      // Return terazes path with car IDs
      return `${
        appPaths[`new-${vehicleCategorySlug}-compare-terazes`]
      }/${carIds.join('/')}`;
    } else {
      // Fallback to terazes page if no valid IDs
      return appPaths[`new-${vehicleCategorySlug}-compare-terazes`];
    }
  };

  const getCompareText = () => {
    const selectedCarsLength = selectedCars.filter(
      (car) => car !== null,
    ).length;
    if (isMob && selectedCarsLength > 0) {
      return `${t('Compare')} (${selectedCarsLength} ${t('Selected')})`;
    }
    return t('Compare');
  };

  const canCompare = () => {
    return selectedCars.filter((car) => car !== null).length >= 2;
  };

  return (
    <div className="w-full px-0">
      <div className="md:space-y-9 pt-8 md:pt-20 pb-0">
        <div className="flex flex-col md:flex-row md:justify-end md:items-center gap-4">
          {/* {!isMob && (
            <Breadcrumbs
              list={getBreadcrumbsList()}
              className="text-white mb-2 [&_a]:text-white [&_span]:text-white"
            />
          )} */}

          {selectedCars.length < maxCars && !isMob && (
            <Button
              variant="glassy"
              onClick={handleAddCar}
              icon={<Plus className="w-4 h-4" />}
            >
              {t('Add another car to compare')}
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-lg py-4 md:py-6">
        {/* Mobile: Carousel cards */}
        {isMob ? (
          <CarouselSection
            pageSection={PAGE_SECTIONS.COMPARE_CARS}
            isMobile={isMob}
            itemBasis="basis-[320px]"
            carouselOpts={{
              align: 'start',
              loop: false,
              containScroll: 'trimSnaps',
            }}
            className="w-full"
            contentClassName="gap-3"
            setApi={setCarouselApi}
          >
            {selectedCars.map((car, index) => {
              return (
                <div key={index} className="flex flex-row gap-1">
                  <div className="flex-shrink-0 w-[290px]">
                    <CarSelectionCard
                      classMandatory={true}
                      isMobile={isMob}
                      onSelect={(car) => handleCarSelect(car, index)} //after a delay, move to next card
                      onRemove={() => handleCarRemove(index)}
                      selectedCar={car}
                      placeholder={t('Select a Vehicle')}
                      showRemove={!!car}
                      hasError={carErrors[index]}
                      categorySlug={vehicleCategorySlug}
                    />
                  </div>
                  {!(index === selectedCars.length - 1) && (
                    <div className="flex-shrink-0 flex items-center justify-center px-1">
                      <div className="bg-[#B3B3B333] text-secondary rounded-full w-6 h-12 flex items-center justify-center text-xs font-semibold">
                        {t('vs')}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </CarouselSection>
        ) : (
          <div className="flex flex-wrap gap-4 items-stretch">
            {selectedCars.map((car, index) => {
              return (
                <React.Fragment key={index}>
                  <div className="flex-1 min-w-0">
                    <CarSelectionCard
                      classMandatory={true}
                      isMobile={isMob}
                      onSelect={(car) => handleCarSelect(car, index)}
                      onRemove={() => handleCarRemove(index)}
                      selectedCar={car}
                      placeholder={t('Select a Vehicle')}
                      showRemove={!!car}
                      hasError={carErrors[index]}
                      categorySlug={vehicleCategorySlug}
                    />
                  </div>
                  {!(index === selectedCars.length - 1) && (
                    <div className="flex-shrink-0 flex items-center justify-center px-1">
                      <div className="bg-[#B3B3B333] text-secondary rounded-full w-6 h-12 flex items-center justify-center text-xs font-semibold">
                        {t('vs')}
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}

        {selectedCars.length > 0 && (
          <div
            className={cn(
              'flex flex-col items-center gap-3 mt-4 md:mt-6 px-0',
              !isMob && 'pb-5',
            )}
          >
            <Button
              variant="secondary"
              size="xl"
              href={canCompare() ? getTerazesUrl() : undefined}
              className="w-full md:w-[280px] disabled:opacity-60"
              disabled={!canCompare()}
              aria-disabled={!canCompare()}
            >
              {getCompareText()}
            </Button>

            {/* Mobile add car button */}
            {selectedCars.length < maxCars && isMob && (
              <Button
                variant="glassy"
                size="xl"
                onClick={handleAddCar}
                icon={<Plus className="w-4 h-4" />}
                className="w-full md:w-[280px]"
              >
                {t('Add another car to compare')}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompareHeroSection;
