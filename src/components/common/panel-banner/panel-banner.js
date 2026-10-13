import { ChevronLeftIcon } from 'lucide-react';

import BackButton from '@/components/common/backButton';
import InlineItems from '@/components/common/inlineItems/inlineItems';
import NextImage from '@/components/common/nextImage';
import PanelBannerActionButton from '@/components/common/panel-banner/panel-banner-action-button';
import Text from '@/components/common/text';
import { cn } from '@/utils';
import { getAsset } from '@/utils/general';

export default function PanelBanner({
  title,
  subtitleItems,
  imageSrc,
  imageAlt,
  isMobile = false,
  showBackButton,
  actionButton,
  className,
  imageClassName,
}) {
  const shouldShowBack = showBackButton ?? isMobile;
  const showActionButton =
    actionButton?.label && actionButton?.onClick && !isMobile;
  const hasSubtitleItems =
    Array.isArray(subtitleItems) && subtitleItems.length > 0;

  return (
    <div
      className={cn(
        'relative flex justify-between gap-4 bg-cover bg-center bg-no-repeat px-5 py-5 md:py-6',
        isMobile && 'pt-7',
        className,
      )}
      style={{
        backgroundImage: `url(${getAsset('/assets/detail-banner.webp')})`,
      }}
    >
      {shouldShowBack && (
        <BackButton
          variant="ghost"
          className=" absolute start-1 top-3 z-10 h-auto w-auto p-0 text-gray hover:bg-transparent"
        >
          <ChevronLeftIcon className="size-5 flipX text-gray-400" />
        </BackButton>
      )}
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
        <Text weight="bold" className="text-xl text-gray-900 md:text-2xl">
          {title}
        </Text>
        {hasSubtitleItems ? (
          <InlineItems
            items={subtitleItems}
            className="text-sm text-gray"
            spaceClass="gap-1"
          />
        ) : null}
        {showActionButton ? (
          <PanelBannerActionButton
            label={actionButton.label}
            onClick={actionButton.onClick}
          />
        ) : null}
      </div>
      {imageSrc ? (
        <div className="flex shrink-0 items-end self-end">
          <NextImage
            src={imageSrc}
            alt={imageAlt ?? title}
            width={280}
            height={160}
            className={cn(
              'h-auto   max-w-[100px] object-contain md:max-w-[150px]',
              imageClassName,
            )}
            priority
          />
        </div>
      ) : null}
    </div>
  );
}
