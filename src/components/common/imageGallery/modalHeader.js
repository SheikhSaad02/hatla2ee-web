import { cn } from '@/utils';
import { useTranslations } from 'next-intl';
import InfoCTAButtons from '../infoCard/infoCtaButtons';
import { getContactPresence } from '@/utils/contactDetails';
import InlineItems from '../inlineItems/inlineItems';
import Price from '../price/price';
import SpecificationList from '../specificationList/specificationList';
import Text from '../text';
import { getDurationInMonths } from '@/utils/car-finance';

const GalleryModalHeader = ({
  title,
  specificationList,
  price,
  financed,
  min_deposit,
  min_installment,
  duration,
  isMob,
  darkMode,
  contact_details,
  ctaMetrics,
  ctaEventsProps,
  sold_at,
}) => {
  const t = useTranslations('common');
  const durationInMonths = getDurationInMonths(duration);

  const { phone, whatsapp, mobile } = contact_details || {};

  const phoneNumber = mobile || phone;

  return (
    <div
      className={cn(
        'w-full flex flex-col gap-3 md:flex-row md:items-center justify-between dark:text-white bg-[#222222E5] shadow-[0px_1px_6px_#C9C9C924] py-3 px-4 rounded-md',
        darkMode && 'dark',
      )}
    >
      <div className="gap-2 flex flex-col pr-6 md:pr-0 rtl:pr-0 rtl:md:pr-0 rtl:pl-6 rtl:md:pl-0">
        <Text as="h2" className="font-bold text-xl">
          {title}
        </Text>

        {!isMob && specificationList && (
          <SpecificationList
            specificationList={specificationList}
            isMob={isMob}
            darkMode
            className={'px-2 py-1'}
            titleClassName="lg:text-xs"
          />
        )}
      </div>
      <div className="flex flex-col gap-3 md:items-end">
        <Price
          className="text-3xl md:text-2xl text-primary-800 dark:text-white"
          valueClassName="font-semibold"
          currencyClassName="font-semibold text-primary-800 dark:text-white"
          value={price}
        />

        {!isMob && (
          <>
            <InfoCTAButtons
              contactInfo={{
                call: phoneNumber,
                whatsapp: whatsapp,
                presence: getContactPresence(contact_details),
              }}
              btnSize={'lg'}
              ctaMetrics={ctaMetrics}
              classWrapper={cn(
                'md:rtl:mr-auto md:ltr:ml-auto gap-2 *:basis-[50%] md:basis-auto md:basis-[40%]',
              )}
              classNameWhatsapp="min-w-33"
              classNamePhoneNumber="min-w-33"
              sold_at={sold_at}
              {...ctaEventsProps}
            />
          </>
        )}

        {financed && (
          <div className="flex">
            <InlineItems
              className="text-xs lg:text-sm text-gray-700 dark:text-white justify-start md:justify-end"
              items={[
                min_deposit && {
                  label: (
                    <>
                      {t('Deposit')}{' '}
                      <Price
                        value={min_deposit}
                        currencyClassName="dark:text-gray-200"
                        valueClassName="max-w-[9ch] truncate"
                      />
                    </>
                  ),
                },
                min_installment && {
                  label: (
                    <>
                      {t('Installment ')}
                      <Price
                        value={min_installment}
                        currencyClassName="dark:text-gray-200"
                        valueClassName="max-w-[7ch] truncate"
                      />{' '}
                      {t(' /month')}
                    </>
                  ),
                },
                durationInMonths != null && {
                  label: (
                    <>
                      {!isMob && t('Duration ')}
                      <span className="inline-flex items-baseline">
                        <span className="leading-none font-bold">
                          {durationInMonths}
                        </span>
                        <span className="leading-none ms-1 font-normal text-muted-foreground dark:text-gray-200">
                          {t(' Months')}
                        </span>
                      </span>
                    </>
                  ),
                },
              ].filter(Boolean)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryModalHeader;
