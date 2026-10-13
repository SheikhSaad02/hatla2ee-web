import BaseCard from '@/components/common/baseCard/baseCard';
import { PriceBlock } from '@/components/common/carPriceCardMobile/priceBlock';
import DownloadBrochure from '@/components/common/downloadBrochure/downloadBrochure';
import LeadCampaignActions from '@/components/common/newCarListingActions/leadCampaignActions';
import NextImage from '@/components/common/nextImage';
import NextLink from '@/components/common/nextLink';
import PriceRange from '@/components/common/priceRange/priceRange';
import Text from '@/components/common/text';
import { CardContent } from '@/components/ui/card';
import { IMAGES_BASE_URL } from '@/constants';
import { formatNumberValue } from '@/utils/numbers';
import { getLocaleStringServer, isMobileServer } from '@/utils/serverFunctions';
import { getTranslations } from 'next-intl/server';

export const ModelHeader = async ({
  listing,
  priceNotAvailable,
  showLeadCampaignActions = false,
}) => {
  const t = await getTranslations({ namespace: 'common' });
  const isMobile = await isMobileServer();
  const makeLabel = await getLocaleStringServer(listing?.make, 'label');
  const modelLabel = await getLocaleStringServer(listing?.model, 'label');

  const warrantyItems = [
    {
      labelKey: 'Warranty',
      kms: listing?.warranty_in_kms,
      years: listing?.warranty_in_years,
    },
    {
      labelKey: 'Battery Warranty',
      kms: listing?.battery_warranty_in_kms,
      years: listing?.battery_warranty_in_years,
    },
  ].filter(({ kms, years }) => kms || years);

  return (
    <BaseCard className="flex flex-col bg-gray-50 lg:bg-white card-light max-lg:rounded-none max-lg:mx-[-1rem]">
      <CardContent className="flex flex-col lg:flex-row lg:gap-6 p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:gap-10 flex-1 lg:items-center">
          {isMobile ? (
            <div className="flex justify-between items-center w-full">
              <NextImage
                src={listing?.images?.[0]?.medium}
                width={106}
                height={64}
                alt={t('Image')}
              />
              <DownloadBrochure pdfURL={listing?.brochure_url} />
            </div>
          ) : (
            <NextImage
              src={
                listing?.images?.[0]?.medium ||
                `${IMAGES_BASE_URL}/${listing?.make?.slug}/medium.png`
              }
              priority={true}
              fetchPriority="high"
              alt={t('Image')}
              width={325}
              height={200}
              // className="w-[90] h-[45] lg:w-[290] lg:h-[180]"
              className="object-contain aspect-3/2"
            />
          )}

          <div className="flex flex-col gap-3 lg:gap-7 flex-1">
            <Text
              as="h2"
              className="sectionHeading mb-0 font-semibold max-lg:text-base"
            >
              {getLocaleStringServer(listing, 'title')}
            </Text>
            {showLeadCampaignActions && (
              <LeadCampaignActions
                entityType="NewListing"
                source="model_level"
                entityId={listing?.id}
                make={listing?.make?.slug}
                model={listing?.model?.slug}
                isMob={isMobile}
                launch_year={listing?.launch_year}
                gridView={isMobile ? true : false}
              />
            )}
            {/* <NextLink
              title={`${makeLabel} ${modelLabel} New Cash or Installment`}
              href={`/new-car/${listing?.make.slug}/${listing?.model?.slug}`}
              className={'text-sm text-primary self-start'}
            >
              {getLocaleStringServer(listing?.make, 'label')}{' '}
              {getLocaleStringServer(listing?.model, 'label')}
            </NextLink> */}

            <div className="flex gap-2 lg:gap-10 w-full">
              {/* <PriceBlock
                label={t('Official Price')}
                // labelClassName={'text-base'}
                valueClassName={'lg:text-xl'}
                min={listing?.min_official_price}
                max={listing?.max_official_price}
                className={'priceBlock bg-white'}
                isRange

              /> */}

              <PriceRange
                label={t('Official Price')}
                // labelClassName={'text-base'}
                valueClassName={'lg:text-xl'}
                min={listing?.min_official_price}
                max={listing?.max_official_price}
                priceNotAvailable={priceNotAvailable}
                className={'priceBlock bg-white p-2 lg:p-0'}
              />

              <PriceRange
                label={t('Market Price')}
                // labelClassName={'text-base'}
                valueClassName={'lg:text-xl'}
                min={listing?.min_market_price}
                max={listing?.max_market_price}
                className={'priceBlock bg-white p-2 lg:p-0'}
              />
            </div>
            {warrantyItems.length > 0 && (
              <div className="flex gap-2 lg:gap-10 w-full">
                {warrantyItems.map(({ labelKey, kms, years }) => (
                  <div key={labelKey} className="flex flex-col w-full">
                    <Text className="text-gray fs-body mb-1">{t(labelKey)}</Text>
                    <strong className="font-semibold fs-body">
                      {kms && `${formatNumberValue(kms)} ${t('Km')}`}
                      {kms && years && ' / '}
                      {years && `${years} ${t('Years')}`}
                    </strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {!isMobile && <DownloadBrochure pdfURL={listing?.brochure_url} />}
      </CardContent>
    </BaseCard>
  );
};
