import BaseCard from '@/components/common/baseCard/baseCard';
import Table from '@/components/common/table/table';
import Text from '@/components/common/text';
import { CardContent } from '@/components/ui/card';
import { cn } from '@/utils';
import { useLocale, useTranslations } from 'next-intl';
import { ModelHeader } from './modelHeader';
import { variantsTableColumns } from './variantTableColumns';
import PriceCard from '@/components/common/carPriceCardMobile/priceCard';
import { getLocaleString, mapFeaturesToStrings } from '@/utils/general';

const NewCarsGenerationCard = ({
  className,
  listing,
  isMobile,
  renderGenerationDetail = true,
}) => {
  const t = useTranslations('common');
  const locale = useLocale();

  return (
    <>
      <BaseCard
        className={cn('flex md:rounded-xl p-0 max-lg:border-0', className)}
      >
        <CardContent className="flex gap-4 flex-col">
          {renderGenerationDetail && (
            <ModelHeader
              listing={listing}
              showLeadCampaignActions
              priceNotAvailable={listing?.price_not_available}
            />
          )}
          {!isMobile ? (
            <Table
              data={listing?.variantsTableData}
              columns={variantsTableColumns}
              locale={locale}
              wrapperClassName="border-none rounded-t-none"
            />
          ) : (
            listing?.variantsTableData?.map((item, index) => (
              <PriceCard
                key={item.id || index}
                id={item?.id}
                image={item?.actionButton?.item?.image}
                isNewCar={true}
                href={item?.overview.href}
                title={getLocaleString(item?.overview, 'title', locale)}
                description={mapFeaturesToStrings(
                  item?.overview?.features,
                  locale,
                )}
                officialPrice={item?.officialPrice}
                marketPrice={item?.marketPrice}
                minInstallment={item?.minInstallment}
                minDeposit={item?.minDeposit}
                showCompare={true}
                priceNotAvailable={item?.priceNotAvailable}
                hrefCompare={item?.hrefCompare}
              />
            ))
          )}
        </CardContent>
      </BaseCard>
    </>
  );
};

export default NewCarsGenerationCard;
