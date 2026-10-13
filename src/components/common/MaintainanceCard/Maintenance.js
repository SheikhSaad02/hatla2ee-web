'use client';

import { LocationIcon } from '@/icons/basicSvgs';
import { CallIcon } from '@/icons/socials';
import { cn } from '@/utils';
import { useIsMobile } from '@/providers/isMobile';
import BaseCard from '../baseCard/baseCard';
import InfoCTAButtons from '../infoCard/infoCtaButtons';
import Text from '../text';
import TextWithIcon from '../textWithIcon/textWithIcon';
import { useTranslations } from 'next-intl';
import Button from '../button/button';
import { ArrowRightFromLineIcon } from 'lucide-react';
import { googleMapLink } from '@/constants';
import NextLink from '../nextLink';
import { DirectionsIcon } from '@/icons';
import { PAGE_TYPES } from '@/services/analyticsService/constants';

export default function MaintenanceCard({
  title,
  location,
  phones,
  contactAction,
  className,
  latitude,
  longitude,
  href,
}) {
  const isMob = useIsMobile() ?? false;
  const t = useTranslations('common');

  const renderTitle = () => {
    return (
      <Text as="h4" className=" text-sm md:text-xl mb-2.5 md:mb-4 font-bold">
        {title}
      </Text>
    );
  };

  return (
    <BaseCard
      className={cn(
        'group flex flex-col md:flex-row p-3  md:px-5 md:py-6 gap-3 md:gap-1 rounded-md md:rounded-xl items-start md:items-center justify-between',
        className,
      )}
    >
      <div className=" mb-0 md:mb-3.5">
        {href ? (
          <NextLink href={href}>{renderTitle()}</NextLink>
        ) : (
          renderTitle()
        )}

        <div className="flex flex-col gap-2 items-start">
          <TextWithIcon
            icon={<LocationIcon className="text-gray-400 size-4" />}
            description={location}
            className="gap-2 text-dim font-medium "
            descriptionClassName="text-xs md:text-base"
          />

          {phones?.map((number, index) => (
            <NextLink key={index} href={`tel:${number}`}>
              <TextWithIcon
                key={index}
                icon={<CallIcon className="text-gray-400 size-4 flipX" />}
                description={number}
                className="gap-2 text-dim font-medium"
                descriptionClassName="text-xs md:text-base"
              />
            </NextLink>
          ))}
        </div>
      </div>

      {/* <Button
        variant="tertiary"
        className="px-3 w-full md:max-w-[275px] group-hover:bg-primary group-hover:text-white"
        icon={<CallIcon size={16} className="flipX" />}
        size={isMob ? 'lg' : 'xl'}
      >
        {t('Show Number')}
      </Button> */}
      <div className="flex gap-2 items-center max-sm:w-full">
        {(latitude || longitude) && (
          <Button
            size={isMob ? 'lg' : 'xl'}
            variant={'tertiary'}
            icon={<DirectionsIcon />}
            className={
              'hover:text-white hover:bg-primary max-sm:px-0 max-sm:flex-1'
            }
            href={`${googleMapLink}${latitude},${longitude}`}
            target={'_blank'}
          >
            {t('Get Directions')}
          </Button>
        )}
        <InfoCTAButtons
          contactInfo={contactAction}
          classWrapper="max-sm:flex-1"
          classNamePhoneNumber="max-sm:px-2 max-sm:flex-1"
          btnSize={isMob ? 'lg' : 'xl'}
          localisedName={title}
          title={t('Contact Maintenance Center')}
          fullWidth
          pageType={PAGE_TYPES?.MAINTENANCES_CENTER}
        />
      </div>
    </BaseCard>
  );
}
