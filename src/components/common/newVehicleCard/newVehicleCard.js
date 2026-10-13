'use client';

import { CardContent, CardFooter, CardHeader } from '@/components/ui/card';

import BaseCard from '../baseCard/baseCard';
import { ChevronArrowBubble } from '@/icons';
import { CashBackIcon, DiscountIcon } from '@/icons/basicSvgs';
import LinkWithIcon from '../linkWithIcon/linkWithIcon';
import NextImage from '../nextImage';
import Price from '../price/price';
import PriceRange from '../priceRange/priceRange';
import TextWithIcon from '../textWithIcon/textWithIcon';
import { cn } from '@/utils';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { InfoIcon } from '@/icons';

export default function NewVehicleCard({
  href = '#',
  title,
  count,
  img,
  price,
  className,
  showFinancingDetail = false,
  discountedPrice = null,
  prioritizeFirstImage = false,
}) {
  const t = useTranslations('home');
  const commonT = useTranslations('common');
  const router = useRouter();

  return (
    <BaseCard
      onClick={() => router.push(href)}
      className={cn(
        'card group hover:shadow-sm',
        'flex flex-col p-0 gap-0 h-full',
        'cursor-pointer',
        className,
      )}
    >
      <CardHeader className="p-3 pb-0 min-h-20">
        <LinkWithIcon
          title={title}
          href={href}
          titleClassName="lg:text-lg mb-1 group-hover:text-primary font-semibold"
          description={
            count && count > 1
              ? `${count} ${t('Classes')}`
              : count === 1
              ? `${count} ${t('Class')}`
              : ''
          }
          descriptionClassName="sm:text-xs text-xs text-gray-600"
          icon={
            <span className="opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1.5">
              <ChevronArrowBubble />
            </span>
          }
          iconPosition="right"
          className="w-full"
          contentClassName="min-w-0"
        />
      </CardHeader>

      <CardContent className="relative h-[150px] overflow-hidden">
        <div className="flex h-full w-full items-center justify-center transition-transform duration-300 group-hover:scale-105 origin-center">
          <NextImage
            src={img}
            alt={title || 'Image'}
            width={210}
            height={150}
            className="object-contain w-full h-full max-h-full flipX"
            priority={prioritizeFirstImage}
            fetchPriority={prioritizeFirstImage ? 'high' : 'auto'}
          />
        </div>
      </CardContent>

      <CardFooter
        className="flex flex-col gap-3 p-3 flex-1
        bg-gradient-to-t from-[#F4F8FD] to-white
        group-hover:from-[#E8F1FC] group-hover:to-white
        transition-colors duration-300"
      >
        {price?.priceNotAvailable === true ? (
          <TextWithIcon
            className="gap-1.5"
            icon={<InfoIcon className="w-4 h-4 text-gray-700" />}
            titleClassName={'text-xs  text-gray-500'}
            title={commonT('Price Not Available')}
          />
        ) : (
          <>
            <PriceRange
              label={commonT('Starting From')}
              min={price?.official?.min}
              max={price?.official?.max}
            />

            {/* <hr className="border-t border-dashed my-0 w-full" /> */}
            {/* {!showFinancingDetail ? (
          <PriceRange
            label={commonT('Market Price')}
            min={price?.market?.min}
            max={price?.market?.max}
          />
        ) : ( */}
            {showFinancingDetail && (
              <div className="flex w-full gap-2">
                {price?.minDeposit && (
                  <PriceRange
                    label={commonT('Min Deposit')}
                    min={price?.minDeposit}
                    className="flex-1"
                  />
                )}
                {price?.minInstallment && (
                  <PriceRange
                    label={commonT('Min installment')}
                    min={price?.minInstallment}
                    className="flex-1"
                  />
                )}
              </div>
            )}
            {/* )} */}
            {(price?.discountUpto || price?.cashback) && (
              <div className="flex flex-col w-full gap-1">
                {price?.discountUpto && (
                  <TextWithIcon
                    className="gap-1"
                    icon={<DiscountIcon />}
                    titleClassName={
                      'font-normal italic text-xs lg:text-sm text-gray-light'
                    }
                    // className="font-normal"
                    title={
                      <>
                        {commonT('Discount Upto ')}
                        <Price
                          value={price?.discountUpto}
                          currencyClassName="font-normal text-gray-light"
                          valueClassName="font-normal"
                        />
                      </>
                    }
                  />
                )}
                {price?.cashback && (
                  <TextWithIcon
                    className="gap-1"
                    icon={<CashBackIcon />}
                    titleClassName={
                      'font-normal italic text-xs lg:text-sm text-gray-light'
                    }
                    title={
                      <>
                        {commonT('Cash Back ')}
                        <Price
                          value={price?.cashback}
                          currencyPosition="left"
                          currencyClassName="font-normal text-gray-light"
                          valueClassName="font-normal"
                        />
                      </>
                    }
                  />
                )}
              </div>
            )}
          </>
        )}
      </CardFooter>
    </BaseCard>
  );
}
