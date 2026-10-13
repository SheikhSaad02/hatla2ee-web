'use client';
import { useTranslations } from 'next-intl';
import BaseCard from '../baseCard/baseCard';
import { PriceBlock } from './priceBlock';
import PriceChange from '../priceChange/priceChange';
import Text from '../text';
import ImageWithContent from '../imageWithContent/imageWithContent';
import { InfoIcon } from '@/icons';
import CompareButton from '../compareNewVehicle/compareButton';
import { useRouter } from '@/i18n/navigation';

export default function PriceCard({
  href = '',
  hrefTitle = '',
  title = '',
  id,
  image,
  description,
  isNewCar = false,
  avgPrice,
  minPrice,
  maxPrice,
  oldPrice,
  newPrice,
  officialPrice,
  minDeposit,
  minInstallment,
  marketPrice = {},
  priceChange = {},
  isPriceChange = false,
  showCompare = false,
  priceNotAvailable,
  fallbackText = 'Price Not Available',
  hrefCompare,
}) {
  const t = useTranslations('common');
  const router = useRouter();

  return (
    <BaseCard
      className={`price-card gap-3 ${
        isNewCar && officialPrice == 0
          ? 'rtl:bg-gradient-to-l bg-gradient-to-r from-white to-[#FFFBFA]'
          : ''
      }`}
      onClick={() => href && router.push(href)}
    >
      <div className="flex gap-2 justify-between">
        <ImageWithContent
          href={href}
          hrefTitle={hrefTitle}
          title={title}
          titleClassName={href && 'text-primary'}
          description={description}
          imgSrc={image}
          imageProps={{
            wrapperClassName: 'w-[36px] object-contain aspect-3/2',
          }}
        />
        {showCompare && priceNotAvailable !== true && (
          <div onClick={(e) => e.stopPropagation()}>
            <CompareButton
              item={{ id, title, image, href: hrefCompare }}
              size="lg"
            />
          </div>
        )}
      </div>
      {isPriceChange ? (
        <>
          <div className="grid grid-cols-2 gap-1">
            <PriceBlock label={t('Old Price')} price={oldPrice} />
            <PriceBlock label={t('New Price')} price={newPrice} />
          </div>

          <div className="flex flex-col gap-0.5">
            <Text className="flex flex-col text-gray-light">
              {t('Change in Official Price')}
            </Text>
            <PriceChange
              value={priceChange.value}
              dateOfChange={priceChange.dateOfChange}
            />
          </div>
        </>
      ) : isNewCar ? (
        <div className="grid grid-cols-2 gap-1">
          {officialPrice == 0 || priceNotAvailable === true ? (
            <div className="flex items-center gap-1 text-danger">
              {fallbackText && <InfoIcon className="w-4 h-4" />}
              <span>{t(fallbackText) ?? '-'}</span>
            </div>
          ) : (
            <>
              <PriceBlock label={t('Official Price')} price={officialPrice} />
              <PriceBlock
                label={t('Market Price')}
                price={marketPrice}
                isRange
              />
              {minDeposit && (
                <PriceBlock label={t('Min Deposit')} price={minDeposit} />
              )}
              {minInstallment && (
                <PriceBlock
                  label={t('Min installment')}
                  price={minInstallment}
                />
              )}
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          <PriceBlock label={t('Average Price')} price={avgPrice} />
          <PriceBlock label={t('Minimum Price')} price={minPrice} />
          <PriceBlock label={t('Maximum Price')} price={maxPrice} />
        </div>
      )}
    </BaseCard>
  );
}
