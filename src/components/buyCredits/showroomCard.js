import NextImage from '@/components/common/nextImage';
import { MapPin, Star } from 'lucide-react';
import BaseCard from '@/components/common/baseCard/baseCard';
import NextLink from '@/components/common/nextLink';
import { getAsset } from '@/utils/general';
import Text from '@/components/common/text';
import TextWithIcon from '@/components/common/textWithIcon/textWithIcon';
import { Separator } from '@/components/ui/separator';

const LOGO_PLACEHOLDER = '/assets/showroom-placeholder-image.png';
const logoSrc = (logo) =>
  logo?.startsWith('http') ? logo : getAsset(logo || LOGO_PLACEHOLDER);

// Fixed 327x257 tile: centred logo, name + featured badge, location pill.
// The whole tile links to the showroom detail page.
export default function ShowroomCard({ showroom, t }) {
  return (
    <NextLink
      href={`/showroom/${showroom.slug}`}
      title={showroom.name}
      className="block cursor-pointer rounded-3xl transition-shadow duration-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <BaseCard className="h-[257px] w-[327px] shrink-0 justify-center gap-0 rounded-3xl border-surface-muted bg-[#fafafa] p-4">
        <div className="relative mx-auto size-[90px] shrink-0 overflow-hidden rounded-2xl bg-white">
          <NextImage
            src={logoSrc(showroom.logo)}
            alt=""
            fill
            sizes="90px"
            className="object-cover"
          />
        </div>
        <div className="mt-3 flex items-center justify-center gap-2">
          <Text
            as="h3"
            weight="bold"
            className="truncate text-xl text-gray-900"
          >
            {showroom.name}
          </Text>
          {showroom.featured && (
            <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-secondary text-white">
              <Star
                className="size-3.5 fill-current"
                aria-label={t('showrooms.featured')}
              />
            </span>
          )}
        </div>
        <div className="mt-2 flex items-center justify-center gap-3 text-sm">
          {showroom.location && (
            <TextWithIcon
              icon={<MapPin className="size-4" aria-hidden="true" />}
              description={showroom.location}
              className="min-w-0 gap-1.5 text-gray-500"
              contentClassName="min-w-0"
              descriptionClassName="truncate text-sm"
            />
          )}
          {showroom.location && showroom.carCount != null && (
            <Separator
              orientation="vertical"
              className="bg-gray-200 data-[orientation=vertical]:h-4"
            />
          )}
          {showroom.carCount != null && (
            <span className="shrink-0 rounded-lg bg-gray-100 px-3 py-1 font-medium text-gray-600">
              {t('showrooms.carsCount', { count: showroom.carCount })}
            </span>
          )}
        </div>
      </BaseCard>
    </NextLink>
  );
}
