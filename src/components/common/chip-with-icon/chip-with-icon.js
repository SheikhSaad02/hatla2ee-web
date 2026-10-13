import { cn } from '@/utils';
import NextLink from '../nextLink';
import ClickEventTracker from '@/services/analyticsService/clickTracker';
import NextImage from '../nextImage';
export const ChipWithIcon = ({
  href,
  hrefTitle,
  label,
  icon,
  count,
  className,
  iconClassName,
  spriteClassName,
  spriteStyle,
  optionClickGaEvent = '',
  optionText,
  tabLabel = '',
  pageType = '',
  pageSection = '',
  img,
}) => {
  return (
    <ClickEventTracker
      gaEvent={optionClickGaEvent}
      tabLabel={tabLabel}
      label={optionText}
      pageType={pageType}
      pageSection={pageSection}
    >
      <NextLink
        href={href}
        title={hrefTitle}
        className={cn(
          'px-4 py-2 bg-gray-50 hover:bg-primary-50 hover:font-semibold rounded-md text-sm whitespace-nowrap inline-flex items-center gap-1.5',
          className,
        )}
      >
        {spriteClassName ? (
          <span className={cn(spriteClassName)} style={{ ...spriteStyle }} />
        ) : img ? (
          <NextImage
            src={img}
            width={100}
            height={100}
            alt={label || 'image'}
            className={cn('w-8 h-8 object-contain')}
          />
        ) : icon ? (
          <span className={cn('w-3 h-3', iconClassName)}>{icon}</span>
        ) : null}
        <span>{label}</span>
        {count && <span className="ms-1">({count})</span>}
      </NextLink>
    </ClickEventTracker>
  );
};
