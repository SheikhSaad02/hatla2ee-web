import { ChevronLeftIcon, InfoIcon, PlusIcon } from 'lucide-react';
import NextImage from '@/components/common/nextImage';
import Text from '@/components/common/text';
import Button from '@/components/common/button/button';
import { getLocaleStringServer, isMobileServer } from '@/utils/serverFunctions';
import { cn } from '@/utils';
import { getCarEvaluation } from '@/apis/used-car-prices';
import Alert from '@/components/common/alert/alert';
import { getLocale, getTranslations } from 'next-intl/server';
import BaseCard from '../common/baseCard/baseCard';
import BackButton from '../common/backButton';
import { LocaleSwitcher } from '../common/LocaleSwitcher';
import { Tooltip } from '../common/tooltip/tooltip';
import Price from '../common/price/price';
import { BottomBar } from '../common/bottomBar';
import DrawerWrapper from '../common/drawer';
import { appPaths } from '@/constants';

export default async function CarEvaluationCard({ carEvaluationDetail = {} }) {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'carEvaluation' });
  const isMobile = await isMobileServer();
  const { make, model, year } = carEvaluationDetail;
  const [makeLabel, modelLabel] = await Promise.all([
    getLocaleStringServer(make, 'label'),
    getLocaleStringServer(model, 'label'),
  ]);
  const carEvaluation = await getCarEvaluation({
    make: make?.slug,
    model: model?.slug,
    year,
  });
  const title = !!Object.keys(carEvaluationDetail).length
    ? `${makeLabel} ${modelLabel} ${year}`
    : null;

  const renderTooltipTrigger = () => (
    <InfoIcon className="w-3 h-3 text-gray-500 cursor-pointer" />
  );

  const renderTooltipContent = () =>
    t(
      'The estimated price reflects the current approximate value of your car and may vary over time',
    );
  const renderPrices = () => {
    return (
      <>
        <div className=" mb-4.5 md:mb-5">
          <Text
            variant="heading"
            className="text-2xl md:text-[40px] font-bold text-black"
          >
            <Price value={carEvaluation?.avg_price} />
          </Text>
          <Text className="text-[14px] flex items-center  gap-1">
            <span className="font-medium">{t('Estimated Average Price')}</span>

            {isMobile ? (
              <DrawerWrapper
                fullScreen={false}
                trigger={renderTooltipTrigger()}
                title={t('Estimated Average Price')}
              >
                {renderTooltipContent()}
              </DrawerWrapper>
            ) : (
              <Tooltip content={renderTooltipContent()}>
                {renderTooltipTrigger()}
              </Tooltip>
            )}
          </Text>
        </div>

        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-gray-50 px-2 py-1">
              <span className="moreIcon minPriceRangeDetail"></span>
            </div>
            <div className="flex flex-col">
              <Text className="text-sm md:text-base text-gray-500 font-medium">
                {t('Min Price')}
              </Text>
              <Text className="text-xs md:text-xl font-bold text-gray-800">
                <Price value={carEvaluation?.min_price} />
              </Text>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-gray-50 px-2 py-1">
              <span className="moreIcon maxPriceRangeDetail"></span>
            </div>

            <div className="flex flex-col">
              <Text className=" text-sm md:text-base text-gray-500 font-medium">
                {t('Max Price')}
              </Text>
              <Text className="text-xs md:text-xl font-bold text-gray-800">
                <Price value={carEvaluation?.max_price} />
              </Text>
            </div>
          </div>
        </div>
      </>
    );
  };
  const renderAlert = () => {
    return (
      <Alert
        className=" p-5 md:py-5 md:px-9 rounded-lg w-full  border-none"
        description={t(
          'Sorry! We couldn’t find an average price for your car Try evaluating a different car',
        )}
      />
    );
  };

  const getCtaButtons = () => (
    <>
      <Button
        variant="secondary"
        size={isMobile ? 'xl' : 'xxl'}
        href={appPaths.postListing}
        className="flex-1"
        icon={<PlusIcon />}
      >
        {`${t('Sell My Car')}`}
      </Button>
      <Button
        variant="tertiary"
        size={isMobile ? 'xl' : 'xxl'}
        href={appPaths.usedPricesEvaluation}
        className="md:px-10"
      >
        {t('Back to Evaluation')}
      </Button>
    </>
  );

  return (
    <div className="grid gap-6 md:gap-12 grid-cols-1 md:grid-cols-[390_520px] md:items-center">
      <div className={cn(isMobile && 'breakout')}>
        {!carEvaluation?.image ? (
          <NextImage
            alt={title}
            width={600}
            height={400}
            className={cn('w-full object-cover h-[290px] md:rounded-2xl')}
          />
        ) : (
          <BaseCard
            className={
              'p-2 lg:p-5 bg-[linear-gradient(to_top,var(--color-primary-200)_0%,_white_100%)] md:w-[388px] h-[289px] border-0 rounded-none md:rounded-2xl'
            }
          >
            <NextImage
              src={carEvaluation?.image}
              alt={title}
              width={isMobile ? 300 : 600}
              height={isMobile ? 200 : 400}
              className={cn('h-full w-full object-contain')}
            />
          </BaseCard>
        )}
        {isMobile && (
          <LocaleSwitcher
            className={
              ' absolute top-4 end-2  h-8 rounded-md  bg-[#6D6D6D66] backdrop-blur-md text-white transition-all duration-300'
            }
          />
        )}
        {isMobile && (
          <BackButton
            variant="glassy"
            className="absolute top-4 start-2 flipX h-8 w-8"
          >
            <ChevronLeftIcon />
          </BackButton>
        )}
      </div>

      <div className="w-full md:space-y-7 space-y-3">
        {title && (
          <Text
            as="h2"
            variant="heading"
            className="text-lg md:text-xl  font-semibold"
          >
            {title}
          </Text>
        )}

        <div>{carEvaluation.avg_price ? renderPrices() : renderAlert()}</div>

        {!isMobile ? (
          <div className={cn('flex flex-row-reverse md:flex-row gap-3')}>
            {getCtaButtons()}
          </div>
        ) : (
          <BottomBar className={'flex flex-row-reverse gap-3'}>
            {getCtaButtons()}
          </BottomBar>
        )}
      </div>
    </div>
  );
}
