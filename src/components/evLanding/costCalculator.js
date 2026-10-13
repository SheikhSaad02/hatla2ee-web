'use client';

import { useMemo, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useUser } from '@/providers/user';
import { evLandingEvents } from '@/services/analyticsService/events';
import { Info } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { RadioGroup } from '../common/radioGroup';
import { Tooltip } from '../common/tooltip/tooltip';
import Button from '../common/button/button';
import DrawerWrapper from '../common/drawer';
import BaseCard from '../common/baseCard/baseCard';
import PointerCard from '../common/pointerCard';
import Price from '../common/price/price';
import Text from '../common/text';
import { cn } from '@/utils';
import { getAsset } from '@/utils/general';
import { formatNumberValue } from '@/utils/numbers';
import { useIsMobile } from '@/providers/isMobile';
import { EV_CALCULATOR, EV_QUICK_CHIPS } from './data';

const {
  avg_mileage,
  petrol_price,
  ev_consumption,
  ev_rate,
  minKm,
  maxKm,
  step,
  defaultKm,
} = EV_CALCULATOR;

const chipOptions = EV_QUICK_CHIPS.map((km) => ({
  value: String(km),
  label: `${km}km`,
}));

const CALCULATOR_BLUE = getAsset('/assets/ev-images/calculator_blue.webp');

const roundTo = (value, nearest) => Math.round(value / nearest) * nearest;

const computeCosts = (km) => {
  const petrolCostDay = Math.round((km / avg_mileage) * petrol_price);
  const evCostDay = Math.round(((km * ev_consumption) / 100) * ev_rate);
  const dailySaving = Math.max(petrolCostDay - evCostDay, 0);
  return {
    petrolCostDay,
    evCostDay,
    annualPetrolCost: roundTo(petrolCostDay * 365, 100),
    yearlySavings: roundTo(dailySaving * 365, 100),
    monthlySavings: roundTo(dailySaving * 30, 50),
  };
};

export default function CostCalculator() {
  const t = useTranslations('evLanding');
  const locale = useLocale();
  const { user } = useUser();
  const isAr = locale === 'ar';
  const savingsCar = getAsset(`/assets/ev-images/cost-calc-${locale}.webp`);
  const isMob = useIsMobile() ?? false;
  const sceneBg = getAsset(
    `/assets/ev-images/calculator_background-${isMob ? 'mweb' : 'web'}.webp`,
  );
  const [dailyKm, setDailyKm] = useState(defaultKm);
  const [isMonthly, setIsMonthly] = useState(false);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);

  const {
    petrolCostDay,
    evCostDay,
    annualPetrolCost,
    yearlySavings,
    monthlySavings,
  } = useMemo(() => computeCosts(dailyKm), [dailyKm]);

  const renderCostBubble = (
    label,
    value,
    note,
    headerClass,
    bodyClass,
    pointerClass,
    wrapperClass,
  ) => (
    <PointerCard
      className={cn('absolute text-center', wrapperClass)}
      header={
        <Text
          weight="semibold"
          className={cn('block py-2 text-white', isMob ? 'text-xs' : 'text-sm')}
        >
          {label}
        </Text>
      }
      headerClassName={headerClass}
      bodyClassName={cn(
        'flex flex-col justify-center gap-1 px-4 shadow-md backdrop-blur-sm',
        bodyClass,
      )}
      pointerClassName={pointerClass}
    >
      <Text
        weight="bold"
        className={cn('text-gray-900', isMob ? 'text-lg' : 'text-2xl')}
      >
        {value}{' '}
        <Text className={cn('text-gray-500', isMob ? 'text-xs' : 'text-sm')}>
          {t('egpPerDay')}
        </Text>
      </Text>
      <Text className={cn('text-gray-400', isMob ? 'text-[10px]' : 'text-xs')}>
        {note}
      </Text>
    </PointerCard>
  );

  const electricBubble = (wrapperClass) =>
    renderCostBubble(
      t('electricCost'),
      evCostDay,
      `@${ev_consumption} ${t('kwhPer100km')}`,
      'bg-primary',
      'bg-white',
      'border-t-white',
      wrapperClass,
    );

  const petrolBubble = (wrapperClass) =>
    renderCostBubble(
      t('petrolCost'),
      petrolCostDay,
      `@${avg_mileage} ${t('kmPerLiter')}`,
      'bg-red-500',
      'bg-white',
      'border-t-white',
      wrapperClass,
    );

  const infoIcon = <Info className="size-4 text-gray-400 cursor-pointer" />;

  const renderHeading = () => (
    <div>
      <div className="flex items-center gap-2">
        <Text
          as="h3"
          weight="bold"
          className="text-lg md:text-2xl text-gray-900"
        >
          {t('calculatorHeading')}
        </Text>
        {isMob ? (
          <Button
            variant="ghost"
            aria-label={t('calculatorDisclaimerTitle')}
            onClick={() => setDisclaimerOpen(true)}
            className="h-auto w-auto p-0 hover:bg-transparent"
          >
            {infoIcon}
          </Button>
        ) : (
          <Tooltip
            content={t('calculatorDisclaimer')}
            className="max-w-[300px] bg-gray-900 text-white"
          >
            {infoIcon}
          </Tooltip>
        )}
      </div>
      <Text as="p" className="text-xs md:text-sm text-gray-600 mt-1">
        {t('calculatorSubtitle')}
      </Text>
    </div>
  );

  const renderControls = () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Text className="text-sm text-gray-700">{t('dailyTravel')}</Text>
        <Text weight="bold" className="text-lg text-gray-900">
          {dailyKm}{' '}
          <Text className="text-xs text-gray-500">{t('kmPerDay')}</Text>
        </Text>
      </div>

      <Slider
        value={[dailyKm]}
        min={minKm}
        max={maxKm}
        step={step}
        onValueChange={([value]) => setDailyKm(value)}
        onValueCommit={([value]) => {
          evLandingEvents.click_ev_calculator(locale, user, 'slider', value);
          evLandingEvents.calculate_savings(
            locale,
            user,
            computeCosts(value).yearlySavings,
          );
        }}
      />

      <RadioGroup
        options={chipOptions}
        value={{ value: String(dailyKm) }}
        onChange={(option) => {
          const value = Number(option.value);
          setDailyKm(value);
          evLandingEvents.click_ev_calculator(locale, user, 'chip', value);
          evLandingEvents.calculate_savings(
            locale,
            user,
            computeCosts(value).yearlySavings,
          );
        }}
        getOptionValue={(option) => option.value}
        getOptionLabel={(option) => `${option.value} ${t('kmUnit')}`}
        className={isMob ? 'flex-wrap' : undefined}
        labelClassName={cn('bg-white whitespace-nowrap', isMob && 'text-center')}
      />
    </div>
  );

  const renderMobile = () => {
    const currentSaving = isMonthly ? monthlySavings : yearlySavings;

    return (
      <section className="flex flex-col gap-3">
        <h2 className="sectionHeading">{t('calculatorTitle')}</h2>
        <BaseCard
          className="relative flex flex-col gap-0 overflow-hidden rounded-xl border-none bg-white bg-cover bg-top bg-no-repeat p-0 shadow-[0_0_3.82px_rgba(0,0,0,0.1)]"
          style={{ backgroundImage: `url(${sceneBg})` }}
        >
          <div className="relative h-[420px]">
            <div className="absolute inset-x-0 top-0 z-10 flex flex-col items-center gap-5 px-5 pt-6 text-center">
              <div className="flex items-center gap-2">
                <Text
                  weight="semibold"
                  className={cn(
                    'text-sm',
                    isMonthly ? 'text-gray-500' : 'text-gray-900',
                  )}
                >
                  {t('yearlySavingsLabel')}
                </Text>
                <Switch checked={isMonthly} onCheckedChange={setIsMonthly} />
                <Text
                  weight="semibold"
                  className={cn(
                    'text-sm',
                    isMonthly ? 'text-gray-900' : 'text-gray-500',
                  )}
                >
                  {t('monthlySavingsLabel')}
                </Text>
              </div>

              <Price
                value={currentSaving}
                valueClassName="text-5xl text-gray-900"
                currencyClassName="text-xl text-gray-500"
              />

              <Text className="text-sm text-gray-700">
                {t('annualPetrolCost', {
                  amount: formatNumberValue(annualPetrolCost),
                })}
              </Text>
            </div>

            {electricBubble('w-[128px] h-[104px] top-[62%] left-[4%]')}
            {petrolBubble('w-[115px] h-[104px] top-[62%] left-[62%]')}
          </div>

          {/* Calculator controls — extra top space so they sit below the cars */}
          <div className="flex flex-col gap-5 px-5 pt-16 pb-8">
            {renderHeading()}
            {renderControls()}
          </div>
        </BaseCard>

        <DrawerWrapper
          isOpen={disclaimerOpen}
          onClose={() => setDisclaimerOpen(false)}
          fullScreen={false}
          childrenClassName="p-4"
        >
          <div className="flex flex-col gap-2">
            <Text as="h3" weight="bold" className="text-lg text-gray-900">
              {t('calculatorDisclaimerTitle')}
            </Text>
            <Text as="p" className="text-sm text-gray-600">
              {t('calculatorDisclaimer')}
            </Text>
          </div>
        </DrawerWrapper>
      </section>
    );
  };

  const renderDesktop = () => (
    <section className="flex flex-col gap-3 md:gap-6">
      <h2 className="sectionHeading">{t('calculatorTitle')}</h2>

      <div className="flex flex-col lg:flex-row items-stretch gap-4">
        <BaseCard className="relative flex-1 h-[440px] md:h-[548px] gap-0 border-none rounded-2xl overflow-hidden shadow-[0_0_6px_rgba(0,0,0,0.1)]">
          <div
            className="absolute inset-0 bg-cover bg-bottom bg-no-repeat"
            style={{ backgroundImage: `url(${sceneBg})` }}
          />
          <div className="relative z-10 p-6 md:p-8 w-full max-w-[62%] flex flex-col gap-4">
            {renderHeading()}
            {renderControls()}
          </div>

          {electricBubble('w-[181px] h-[139px] top-[45%] left-[17%]')}
          {petrolBubble('w-[181px] h-[139px] top-[45%] left-[62%]')}
        </BaseCard>

        <BaseCard
          className="relative w-full lg:w-[386px] min-h-[280px] lg:min-h-0 gap-5 border-none items-start rounded-2xl shadow-[0_0_6px_rgba(0,0,0,0.1)] bg-cover bg-center text-white pt-20 pb-5 ps-12 pe-5"
          style={{ backgroundImage: `url(${CALCULATOR_BLUE})` }}
        >
          <div
            className={cn(
              'pointer-events-none absolute inset-y-0 start-0 w-[124%] bg-[length:100%_auto] bg-no-repeat',
              isAr ? 'bg-[position:right_bottom]' : 'bg-[position:left_bottom]',
            )}
            style={{ backgroundImage: `url(${savingsCar})` }}
          />

          <div className="relative z-10 flex flex-col gap-5">
            <Text className="text-sm text-white/90">
              {t('annualPetrolCost', {
                amount: formatNumberValue(annualPetrolCost),
              })}
            </Text>
            <div className="flex items-end gap-2">
              <Text weight="bold" className="text-5xl leading-none">
                {formatNumberValue(yearlySavings)}
              </Text>
              <Text className="text-lg">{t('savedYearly')}</Text>
            </div>
            <Text className="text-sm text-white/90">
              {t('monthlySavings', {
                amount: formatNumberValue(monthlySavings),
              })}
            </Text>
          </div>
        </BaseCard>
      </div>
    </section>
  );

  return isMob ? renderMobile() : renderDesktop();
}
