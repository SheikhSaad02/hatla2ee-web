import { LocationIcon } from '@/icons/basicSvgs';
import { CallIcon } from '@/icons/socials';
import BaseCard from '../baseCard/baseCard';
import Text from '../text';
import TextWithIcon from '../textWithIcon/textWithIcon';
import InfoCTAButtons from '../infoCard/infoCtaButtons';
import { cn } from '@/utils';
import { getLocaleStringServer } from '@/utils/serverFunctions';

export default function ShowroomCard(props) {
  const {
    title,
    location,
    number,
    description,
    showContact = false,
    contactAction,
    className,
  } = props;
  return (
    <BaseCard className={cn('flex flex-col p-4 gap-1 rounded-md', className)}>
      <div>
        <Text as="h4" className="text-sm mb-2" weight="semibold">
          {getLocaleStringServer(props, 'title')}
        </Text>
        {location && (
          <TextWithIcon
            icon={<LocationIcon size={16} />}
            description={location}
            className="gap-2 text-gray-light font-medium"
            iconClassName="w-4 flex items-center justify-center"
          />
        )}
        {number && (
          <TextWithIcon
            icon={<CallIcon size={16} className="text-gray-400" />}
            description={number}
            className="gap-2 text-gray-light font-medium"
            iconClassName="w-4 flex items-center justify-center"
          />
        )}

        {description && (
          <TextWithIcon
            // icon={<CallIcon size={16} className="text-gray-400" />}
            description={getLocaleStringServer(props, 'description')}
            className="gap-2 text-gray-light font-medium"
            // iconClassName="w-4 flex items-center justify-center"
          />
        )}
      </div>
      {showContact && (
        <div className="mt-2 flex justify-end">
          <InfoCTAButtons
            contactInfo={contactAction}
            classWrapper="mt-2"
            localisedName={title}
          />
        </div>
      )}
    </BaseCard>
  );
}
