import { useTranslations } from 'next-intl';
import InlineItems from '../inlineItems/inlineItems';
import Price from '../price/price';
import SpecificationList from '../specificationList/specificationList';
import Text from '../text';
import { cn } from '@/utils';
import TextWithIcon from '../textWithIcon/textWithIcon';
import { InfoIcon } from '@/icons';
import { Badge } from '../badge/badge';
import { Separator } from '@/components/ui/separator';
import { getDurationInMonths } from '@/utils/car-finance';
import SellableBadges from '../sellableBadges/sellableBadges';

const ListingOverview = ({
  title,
  specificationList,
  price,
  financed,
  min_deposit,
  min_installment,
  duration,
  isMob,
  darkMode,
  priceNotAvailable,
  badges = [],
}) => {
  const t = useTranslations('common');
  const durationInMonths = getDurationInMonths(duration);

  const durationValue = (
    <span className="inline-flex items-baseline">
      <span className="leading-none font-bold">{durationInMonths}</span>
      <span className="leading-none ms-1 font-normal text-muted-foreground">
        {t(' Months')}
      </span>
    </span>
  );

  const titleEl =
    typeof title === 'object' ? (
      <Text as="h1" className="font-bold text-2xl lg:text-3.5xl">
        <span style={{ display: 'none' }}>{title?.name + ' '}</span>
        {title?.h1}
      </Text>
    ) : (
      <Text as="h1" className="font-bold text-2xl lg:text-3.5xl">
        {title}
      </Text>
    );

  const priceEl =
    priceNotAvailable === true ? (
      <TextWithIcon
        className="gap-1.5 text-danger"
        icon={<InfoIcon className="w-6 h-6 " />}
        titleClassName={'text-lg'}
        title={t('Price Not Available')}
      />
    ) : (
      <div className="flex items-center gap-2">
        <Price
          className="text-2xl md:text-4xl text-primary-800 dark:text-white"
          valueClassName="font-bold"
          currencyClassName="font-bold text-primary-800 dark:text-white"
          value={price}
        />
        {financed && (
          <Badge className="text-sm md:text-xs font-bold shrink-0 border-none bg-primary-800 text-white py-1">
            {t('Financed')}
          </Badge>
        )}
      </div>
    );

  return (
    <div className={cn('w-full flex flex-col gap-2', darkMode && 'dark')}>
      {/* Row 1: title (start) and price + financed badge (end) */}
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between md:gap-4">
        <div className="min-w-0">{titleEl}</div>
        <div className="shrink-0 pt-4 md:text-end">{priceEl}</div>
      </div>

      {/* Row 2: spec tags (start) and financing info (end), on the same line */}
      {(specificationList || financed) && (
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between md:gap-4">
          <div className="min-w-0">
            {specificationList && (
              <SpecificationList
                specificationList={specificationList}
                isMob={isMob}
                darkMode
              />
            )}
          </div>

          {financed && (
            <InlineItems
              className="hide-scrollbar w-full flex-nowrap overflow-x-auto text-xs text-gray-700 lg:text-sm md:w-auto md:justify-end md:overflow-visible"
              spaceClass="shrink-0 whitespace-nowrap"
              separator={
                <Separator
                  variant="dot"
                  className="mx-1 shrink-0 bg-gray-400"
                />
              }
              items={[
                min_deposit && {
                  label: (
                    <>
                      {t('Deposit')}{' '}
                      <Price
                        value={min_deposit}
                        valueClassName="md:max-w-[9ch] md:truncate"
                      />
                    </>
                  ),
                },
                min_installment && {
                  label: (
                    <>
                      {t('Installment ').trim()}{' '}
                      <Price
                        value={min_installment}
                        valueClassName="md:max-w-[7ch] md:truncate"
                      />
                    </>
                  ),
                },
                durationInMonths != null && {
                  label: isMob ? (
                    durationValue
                  ) : (
                    <>
                      {t('Duration ')}
                      {durationValue}
                    </>
                  ),
                },
              ].filter(Boolean)}
            />
          )}
        </div>
      )}

      {isMob && (
        <SellableBadges badges={badges} />
      )}
    </div>
  );
};

export default ListingOverview;
