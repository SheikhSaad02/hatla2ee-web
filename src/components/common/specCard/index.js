'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import Button from '../button/button';
import BaseCard from '../baseCard/baseCard';
import NextImage from '../nextImage';
import DrawerWrapper from '../drawer';
import Text from '../text';
import { cn } from '@/utils';
import { ArrowRight } from 'lucide-react';
import { useUser } from '@/providers/user';
import { evLandingEvents } from '@/services/analyticsService/events';

const SEE_MORE_THRESHOLD = 60;

export default function SpecCard({
  tag,
  title,
  description,
  specs = [],
  buttonLabel,
  buttonHref,
  image,
  imageAlt,
  seeMoreLabel = 'See More',
  className,
  isMobile = false,
  viewAllType,
}) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const locale = useLocale();
  const { user } = useUser();
  const isTruncated = description && description.length > SEE_MORE_THRESHOLD;

  const handleViewAll = () => {
    if (viewAllType) evLandingEvents.click_view_all_type(locale, user, viewAllType);
  };

  const renderViewAllButton = (extraClass) =>
    buttonLabel && (
      <Button
        href={buttonHref}
        onClick={handleViewAll}
        variant="tertiary"
        iconPosition="right"
        icon={<ArrowRight className="size-4 rtl:rotate-180" />}
        className={cn('font-semibold', extraClass)}
      >
        {buttonLabel}
      </Button>
    );

  const renderImage = (extraClass) =>
    image && (
      <NextImage
        src={image}
        alt={imageAlt || title}
        width={320}
        height={200}
        className={cn('w-auto object-contain flex-shrink-0', extraClass)}
      />
    );

  const renderSpec = (spec, i) => (
    <div
      key={i}
      className="flex-1 flex flex-col justify-center gap-0.5 bg-[#F0F0F0] rounded-lg px-4 min-h-[72px]"
    >
      <Text className="text-xs text-gray-500">{spec.label}</Text>
      <Text weight="bold" className="text-base text-gray-900">
        {spec.value}
      </Text>
    </div>
  );

  const renderDesktopContent = () => (
    <div className="flex items-center gap-3 px-6 py-4 min-h-[272px]">
      <div className="flex-1 flex flex-col gap-2 min-w-0">
        {tag && <Text className="text-xs text-primary">{tag}</Text>}
        <Text as="h3" weight="bold" className="text-xl text-gray-900">
          {title}
        </Text>
        {description && (
          <Text as="p" className="text-sm text-gray-600 max-w-[600px]">
            {description}
          </Text>
        )}
        <div className="flex items-stretch gap-4 mt-2 max-w-[740px]">
          {specs.map(renderSpec)}
          {renderViewAllButton('flex-1 min-h-[72px]')}
        </div>
      </div>
      {renderImage('h-[210px]')}
    </div>
  );

  const renderMobileContent = () => (
    <div>
      <div className="flex items-center gap-3 p-4">
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          <Text as="h3" weight="bold" className="text-sm text-gray-900">
            {title}
          </Text>
          {description && (
            <Text as="p" className="text-xs text-gray-600 line-clamp-2">
              {description}
            </Text>
          )}
          {isTruncated && (
            <Button
              variant="link"
              onClick={() => setSheetOpen(true)}
              className="h-auto p-0 text-xs font-semibold self-start"
            >
              {seeMoreLabel}
            </Button>
          )}
          {specs.map((spec, i) => (
            <Text key={i} as="p" className="text-xs">
              <Text className="text-gray-500">{spec.label}: </Text>
              <Text weight="bold" className="text-gray-900">
                {spec.value}
              </Text>
            </Text>
          ))}
        </div>
        {renderImage('h-[80px]')}
      </div>

      <DrawerWrapper
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        fullScreen={false}
        childrenClassName="p-4"
        footer={renderViewAllButton('w-full')}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3 bg-[#F7F9FA] rounded-xl p-4">
            <Text as="p" weight="bold" className="text-base text-gray-900 max-w-[55%]">
              {title}
            </Text>
            {renderImage('h-[90px]')}
          </div>
          <Text as="p" className="text-sm text-gray-600">
            {description}
          </Text>
        </div>
      </DrawerWrapper>
    </div>
  );

  return (
    <BaseCard
      className={cn(
        'border-none gap-0 bg-[#F9F8F8] rounded-xl md:rounded-2xl',
        className,
      )}
    >
      {isMobile ? renderMobileContent() : renderDesktopContent()}
    </BaseCard>
  );
}
