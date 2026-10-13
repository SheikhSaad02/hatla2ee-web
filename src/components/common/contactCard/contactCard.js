import { VerifiedIcon } from '@/icons';
import { LocationIcon } from '@/icons/basicSvgs';
import { ChevronRightIcon } from 'lucide-react';
import LinkWithIcon from '../linkWithIcon/linkWithIcon';
import TextWithIcon from '../textWithIcon/textWithIcon';
import { getTranslations } from 'next-intl/server';
import BaseCard from '../baseCard/baseCard';
import InfoCTAButtons from '../infoCard/infoCtaButtons';
import { getContactPresence } from '@/utils/contactDetails';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getLocaleStringServer, isMobileServer } from '@/utils/serverFunctions';
import Text from '../text';
import ImageWithContent from '../imageWithContent/imageWithContent';
import { cn } from '@/utils';
import ViewAllLink from '../viewAllLink/viewAllLink';
import {
  PAGE_SECTIONS,
  PAGE_TYPES,
} from '@/services/analyticsService/constants';

const ContactCard = async ({
  agency,
  contact_details,
  href,
  darkMode,
  ctaMetrics,
  item = [],
  sold_at,
}) => {
  const t = await getTranslations('common');
  const isMob = await isMobileServer();

  const { profile_image, phone, whatsapp, mobile, email } =
    contact_details || {};
  const { verified: agencyVerified, agency_logo, active } = agency || {};

  const localisedName = await getLocaleStringServer(contact_details, 'name');
  const localisedAgencyName = await getLocaleStringServer(agency, 'name');

  const phoneNumber = mobile || phone;
  const isAgencyListing = !!active;

  const locationSource = isAgencyListing ? agency : contact_details;
  const localisedLocation = await getLocaleStringServer(
    locationSource,
    'location',
  );
  const isIndividualSeller = !isAgencyListing;

  const contactPresence = getContactPresence(contact_details);
  const hasPresenceChannel =
    contactPresence.phone || contactPresence.whatsapp || contactPresence.email;

  const shouldShowForIndividual =
    isIndividualSeller &&
    (isMob
      ? localisedName
      : localisedName || phoneNumber || whatsapp || hasPresenceChannel);

  const shouldShowForAgency =
    isAgencyListing &&
    (isMob
      ? localisedName
      : localisedName || phoneNumber || whatsapp || hasPresenceChannel);

  const shouldShowContact = shouldShowForIndividual || shouldShowForAgency;

  const getDisplayName = () => {
    if (isAgencyListing) {
      return localisedName && localisedAgencyName
        ? `${localisedName} • ${localisedAgencyName}`
        : localisedName || localisedAgencyName;
    }
    return localisedName;
  };

  const shouldShowViewAds = href && isAgencyListing;
  const displayName = getDisplayName();

  return (
    <>
      {shouldShowContact && (
        <BaseCard
          className={cn(
            'gap-0 md:gap-4 p-3 md:p-4 border bg-[linear-gradient(180deg,#FFFFFF_0%,#F4F8FE_100%)] dark:bg-[#222222E5]',
            darkMode && 'dark',
          )}
        >
          {(!isMob || (isMob && displayName)) && (
            <Text as="h5" className="font-semibold dark:text-white">
              {isAgencyListing ? t('Contact Agent') : t('Contact Seller')}
            </Text>
          )}
          {displayName && (
            <div className="flex justify-between gap-3 items-center">
              <ImageWithContent
                titleClassName="flex"
                descriptionClassName="flex"
                title={
                  <TextWithIcon
                    titleClassName="font-bold text-sm md:text-base line-clamp-1 dark:text-white"
                    className={'gap-0.5 md:gap-1'}
                    title={displayName}
                    icon={
                      (contact_details?.verified || agencyVerified) && (
                        <VerifiedIcon className="text-primary w-4 h-4" />
                      )
                    }
                    iconPosition={'right'}
                  />
                }
                {...(localisedLocation && {
                  description: (
                    <TextWithIcon
                      titleClassName="text-muted-foreground font-normal text-xs md:text-sm line-clamp-1"
                      className={'gap-0.5 md:gap-1'}
                      title={localisedLocation}
                      icon={<LocationIcon className="w-4 h-4" />}
                    />
                  ),
                })}
                imgSrc={agency_logo || profile_image}
                imageProps={{
                  wrapperClassName: 'w-10 h-10 md:w-12 md:h-12 relative',
                  imgClassName: 'rounded-lg',
                  alt: displayName,
                }}
              />

              {shouldShowViewAds && (
                <ViewAllLink
                  href={href}
                  title={t('View Ads')}
                  className={'whitespace-nowrap'}
                  iconClassName="bg-white dark:bg-gray-700 dark:text-[#6D9BDF]"
                />
              )}
            </div>
          )}
          {!isMob &&
            (sold_at ? (
              <div className="w-full bg-gray-600 flex justify-center rounded-md px-2.5 py-3">
                <Text className="text-white font-semibold text-base">
                  {t('Sold Out')}
                </Text>
              </div>
            ) : (
              <InfoCTAButtons
                contactInfo={{
                  call: phoneNumber,
                  whatsapp: whatsapp,
                  presence: contactPresence,
                }}
                btnSize={'lg'}
                email={email}
                profile_image={agency_logo || profile_image}
                localisedName={displayName}
                ctaMetrics={ctaMetrics}
                fullWidth
                showDisclaimer
                pageSection={PAGE_SECTIONS?.CONTACT_CARD}
                pageType={PAGE_TYPES?.OFFER_DETAIL}
                item={item}
                classWrapper="[grid-template-columns:repeat(auto-fit,minmax(0,1fr))]"
                sold_at={sold_at}
              />
            ))}
        </BaseCard>
      )}
    </>
  );
};

export default ContactCard;
