import { cn } from '@/utils';
import BaseCard from '../baseCard/baseCard';
import NextImage from '../nextImage';
import { formatNumberValue } from '@/utils/numbers';
import ClickEventTracker from '@/services/analyticsService/clickTracker';
import { getAsset } from '@/utils/general';
const OptionCard = ({
  image,
  imageClassName,
  width = 40,
  height = 40,
  label,
  labelClassName,
  subLabel,
  subLabelClassName,
  contentClassName,
  className,
  imageContainer,
  spriteClassName,
  src,
  optionClickGaEvent = '',
  optionText,
  tabLabel = '',
  pageType = '',
  pageSection = '',
  customImage,
  variant = 'contained',
  interactedFrom,
  cardClassName,
  ...rest
}) => {
  const isContained = variant !== 'default';
  const hasImage = !!(customImage || src || spriteClassName);

  const renderContent = (visibilityClass) => (
    <div
      className={cn(
        'flex flex-col justify-center items-center gap-1',
        contentClassName,
        visibilityClass,
      )}
    >
      {label && (
        <span
          className={cn('group-hover:text-primary fs-body', labelClassName)}
        >
          {label}
        </span>
      )}
      {subLabel && (
        <span
          className={cn(
            'text-gray-500 text-xs lg:text-sm block',
            subLabelClassName,
          )}
        >
          (
          {typeof subLabel === 'number'
            ? formatNumberValue(subLabel)
            : subLabel}
          )
        </span>
      )}
    </div>
  );

  return (
    <ClickEventTracker
      gaEvent={optionClickGaEvent}
      tabLabel={tabLabel}
      label={optionText}
      pageType={pageType}
      pageSection={pageSection}
      interactedFrom={interactedFrom}
    >
      <div
        className={cn('flex flex-col text-center gap-2 group', className)}
        {...rest}
      >
        <BaseCard
          className={cn(
            'w-full border-none rounded-lg bg-gray-50 group-hover:bg-primary-50 group-hover:shadow-sm transition-shadow duration-300',
            isContained && 'lg:gap-0 lg:pb-2',
            cardClassName,
          )}
        >
          {hasImage && (
            <div
              className={cn(
                'flex h-[54px] lg:h-[70px] p-1 flex-col justify-center items-center gap-[5.4px]',
                imageContainer,
              )}
            >
              {/* Render sprite if spriteClassName exists, otherwise render image */}
              {customImage ? (
                customImage
              ) : src ? (
                <NextImage
                  src={src || getAsset('/assets/car-placeholder.svg')}
                  width={width}
                  height={height}
                  className={imageClassName}
                />
              ) : (
                <span className={cn(spriteClassName)} />
              )}
            </div>
          )}
          {isContained && renderContent('hidden lg:flex lg:flex-row')}
        </BaseCard>
        {renderContent(isContained ? 'lg:hidden' : undefined)}
      </div>
    </ClickEventTracker>
  );
};

export default OptionCard;
