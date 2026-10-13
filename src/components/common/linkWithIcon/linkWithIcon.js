import React from 'react';
import NextLink from '../nextLink';
import { cn } from '@/utils';
import { twMerge } from 'tailwind-merge';
import Text from '../text';
import ClickEventTracker from '@/services/analyticsService/clickTracker';

const LinkWithIcon = ({
  icon,
  iconPosition = 'left',
  href,
  title,
  hrefTitle,
  className,
  titleClassName,
  contentClassName,
  description,
  descriptionClassName,
  gaEvent,
  pageType,
  pageSection,
  ...props
}) => {
  const linkContent = (
    <div className={cn('flex gap-2', className)}>
      {icon && iconPosition === 'left' && icon}
      <div className={cn('flex flex-col w-full', contentClassName)}>
        <NextLink
          href={href}
          title={hrefTitle || title}
          className={titleClassName}
          {...props}
        >
          {title}
        </NextLink>

        {description && (
          <Text
            weight="regular"
            className={twMerge('text-xs rtl:text-right', descriptionClassName)}
          >
            {description}
          </Text>
        )}
      </div>
      {icon && iconPosition === 'right' && icon}
    </div>
  );

  if (gaEvent) {
    return (
      <ClickEventTracker
        gaEvent={gaEvent}
        pageType={pageType}
        pageSection={pageSection}
      >
        {linkContent}
      </ClickEventTracker>
    );
  }

  return linkContent;
};

export default LinkWithIcon;
