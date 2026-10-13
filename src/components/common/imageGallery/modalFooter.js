import { VerifiedIcon } from '@/icons';
import { LocationIcon } from '@/icons/basicSvgs';
import { ChevronRightIcon } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import BaseCard from '../baseCard/baseCard';
import InfoCTAButtons from '../infoCard/infoCtaButtons';
import { getContactPresence } from '@/utils/contactDetails';
import { CardContent } from '@/components/ui/card';
import { getLocaleStringServer, isMobileServer } from '@/utils/serverFunctions';
import Text from '../text';
import ImageWithContent from '../imageWithContent/imageWithContent';
import { cn } from '@/utils';
import TextWithIcon from '../textWithIcon/textWithIcon';
import LinkWithIcon from '../linkWithIcon/linkWithIcon';

const GalleryModalFooter = async ({
  agency,
  contact_details,
  href,
  darkMode,
  ctaMetrics,
}) => {
  const t = await getTranslations('common');
  const isMob = await isMobileServer();

  const { profile_image, phone, whatsapp, mobile, email } =
    contact_details || {};
  const { verified: agencyVerified, agency_logo } = agency || {};

  const localisedName = await getLocaleStringServer(contact_details, 'name');
  const localisedAgencyName = await getLocaleStringServer(agency, 'name');

  const phoneNumber = mobile || phone;
  const isAgencyListing = !!agency;

  const locationSource = isAgencyListing ? agency : contact_details;
  const localisedLocation = await getLocaleStringServer(
    locationSource,
    'location',
  );
  const isIndividualSeller = !isAgencyListing;

  const contactPresence = getContactPresence(contact_details);
  const hasPresenceChannel =
    contactPresence.phone || contactPresence.whatsapp || contactPresence.email;

  const shouldShowForIndividual = isIndividualSeller && localisedName;

  const shouldShowForAgency =
    isAgencyListing &&
    (localisedName || phoneNumber || whatsapp || hasPresenceChannel);

  const shouldShowContact = isMob
    ? shouldShowForIndividual || shouldShowForAgency
    : shouldShowForIndividual || shouldShowForAgency;

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
            'rounded-xl border-none gap-0 md:gap-4 md:p-4 md:shadow-[0_2px_10px_#0000001C] dark:bg-[#222222E5] dark:shadow-[0px_1px_6px_#C9C9C924]',
            darkMode && 'dark',
          )}
        >
          <CardContent
            className={cn(
              'dark:flex dark:flex-col dark:md:flex-row dark:md:items-center gap-3',
              !displayName
                ? 'dark:justify-center dark:items-center'
                : 'dark:md:justify-between',
            )}
          >
            {displayName && (
              <div className="flex rounded-xl justify-between gap-3 items-center px-0 md:px-3 p-3 lg:bg-primary-50 md:mb-5 dark:bg-[#0000003D] dark:md:mb-0">
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
                        titleClassName="text-muted-foreground font-normal text-xs md:text-sm line-clamp-1 dark:text-white"
                        className={'gap-0.5 md:gap-1'}
                        title={localisedLocation}
                        icon={<LocationIcon className="w-4 h-4" />}
                      />
                    ),
                  })}
                  imgSrc={profile_image || agency_logo}
                  imageProps={{
                    wrapperClassName: 'w-10 h-10 md:w-12 md:h-12 relative',
                    imgClassName: 'rounded-lg',
                    alt: displayName,
                  }}
                />

                {shouldShowViewAds && (
                  <LinkWithIcon
                    icon={
                      <ChevronRightIcon className="w-4 h-4 text-text rounded-xs shrink-0 flipX bg-gray-800 group-hover:bg-gray-700" />
                    }
                    iconPosition={'right'}
                    href={href}
                    title={t('View Ads')}
                    className="text-primary text-xs hover:text-white font-semibold items-center dark:text-white group"
                    titleClassName="whitespace-nowrap"
                  />
                )}
              </div>
            )}

            <InfoCTAButtons
              contactInfo={{
                call: phoneNumber,
                whatsapp: whatsapp,
                presence: contactPresence,
              }}
              btnSize={'lg'}
              email={email}
              ctaMetrics={ctaMetrics}
              profile_image={profile_image || agency_logo}
              localisedName={displayName}
              fullWidth
              classWrapper={cn(
                ' md:rtl:mr-auto md:ltr:ml-auto gap-2',
                !displayName ? 'flex' : 'md:basis-[40%]',
              )}
              showDisclaimer
            />
          </CardContent>
        </BaseCard>
      )}
    </>
  );
};

export default GalleryModalFooter;
