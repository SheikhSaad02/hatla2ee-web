'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import configs from '@/configs';
import Text from '@/components/common/text';
import Button from '@/components/common/button/button';
import CarSelection from '@/components/carSelection/carSelection';
import { cn } from '@/utils';

const CarEvaluationForm = ({ isMobile, className }) => {
  const [values, setValues] = useState(null);
  const [isError, setIsError] = useState(false);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('carEvaluation');
  const STEPS = useMemo(() => ['brand', 'model', 'year'], []);

  const setCookie = (formValues) => {
    document.cookie = `${configs.evaluate_car_cookie}=${encodeURIComponent(
      JSON.stringify({
        ...formValues,
        make: formValues.brand,
        year: formValues.year?.label,
      }),
    )}; path=/`;
  };

  const handleSubmit = () => {
    if (!STEPS.every((step) => values?.[step])) {
      setIsError(true);
      return;
    }
    setIsError(false);
    setCookie(values);
    router.push(`/${locale}/car/used-prices/evaluate/get-offer`);
  };

  return (
    <div className="flex flex-col w-full rounded-2xl p-1 gap-3 md:gap-9">
      <div className="w-full text-white space-y-1">
        <h1 className="heroHeading">{t('Evaluate Your Car Price')}</h1>
        <Text className="text-sm md:text-2xl">
          {t('Know how much you can sell your car cash')}
        </Text>
      </div>
      <div className={cn('flex gap-2.5 md:gap-4', className)}>
        <CarSelection
          categorySlug={1000}
          isMobile={isMobile}
          elasticSearch
          steps={STEPS}
          onSelect={(formValues) => {
            setValues(formValues);
            setIsError(!STEPS.every((step) => formValues?.[step]));
          }}
          onClear={() => setValues(null)}
          inputProps={{
            showError: isError,
            errorMsg: isError && t('Car selection is required'),
          }}
          size={isMobile ? 'small' : 'large'}
          containerClassName="w-full"
        />

        <Button
          variant="secondary"
          onClick={handleSubmit}
          className={cn('bannerBtn')}
        >
          {t('Evaluate')}
        </Button>
      </div>
    </div>
  );
};

export default CarEvaluationForm;
