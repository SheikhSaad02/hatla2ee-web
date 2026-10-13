'use client';
import { CallIcon } from '@/icons/socials';
import { MapPin } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Accordion from '../common/accordian';
import Button from '../common/button/button';
import Sidebar from '../common/sidebar';
import { getLocaleString } from '@/utils/general';
import { IconLocationGoogle, LocationIcon } from '@/icons/basicSvgs';
import TextWithIcon from '../common/textWithIcon/textWithIcon';
import { useState } from 'react';
import NextLink from '../common/nextLink';
import { googleMapLink } from '@/constants';

const ShowRoomLocations = ({ listingDetailData }) => {
  const t = useTranslations('common');
  const locale = useLocale();
  const [expanded, setExpanded] = useState(false);
  const renderAddresses = (data) => {
    const phoneData = data?.trim() ? data?.split(',') : [];
    const visiblePhones = expanded ? phoneData : phoneData?.slice(0, 2);
    const remainingCount = phoneData?.length - 2;

    return (
      <>
        <div className="flex flex-wrap md:flex-col gap-4 md:gap-3 text-sm text-gray-600">
          {visiblePhones?.map((phone, i) => (
            <NextLink key={i} href={`tel:${phone}`}>
              <TextWithIcon
                titleClassName=" font-semibold text-xs md:text-sm line-clamp-1"
                className={'gap-0.5 md:gap-1 text-primary'}
                title={phone}
                icon={<CallIcon className="w-4 h-4" />}
                key={i}
              />
            </NextLink>
          ))}
        </div>

        {phoneData?.length > 2 && (
          <Button
            variant="link"
            className="p-0 justify-start font-medium"
            onClick={() => setExpanded(!expanded)}
            size="sm"
            style={{ height: 'auto' }}
          >
            {expanded
              ? t('Show less')
              : t('showCount', {
                  count: remainingCount,
                })}
          </Button>
        )}
      </>
    );
  };

  const getTransformedLocations = () => {
    const transformedAddresses = listingDetailData?.addresses.map(
      (address, index) => ({
        id: index,
        trigger: getLocaleString(address.location, 'name', locale),
        content: (
          <div key={index} className="flex flex-col gap-2.5">
            <TextWithIcon
              titleClassName="text-dim font-normal text-xs md:text-sm"
              className={'gap-0.5 md:gap-1'}
              title={getLocaleString(address, 'full_address', locale)}
              icon={<LocationIcon className="w-4 h-4 mt-1" />}
            />

            {renderAddresses(address?.phones)}

            {address?.coordinates?.trim() && (
              <Button
                className="text-xs md:text-sm md:mt-1.5"
                variant="tertiary"
                icon={<IconLocationGoogle />}
                href={`${googleMapLink}${address?.coordinates}`}
                target={'_blank'}
              >
                {t('Show on map')}
              </Button>
            )}
          </div>
        ),
      }),
    );
    return transformedAddresses;
  };
  return (
    <Sidebar className={'py-2 px-1 md:px-2 md:py-5 '}>
      <Accordion
        // allowMultiple={true} // Just add this line
        items={getTransformedLocations()}
        defaultOpen={[getTransformedLocations()?.[0]?.id]}
      />
    </Sidebar>
  );
};
export default ShowRoomLocations;
