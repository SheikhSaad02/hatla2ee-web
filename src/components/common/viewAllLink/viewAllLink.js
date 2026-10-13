'use client';

import React from 'react';
import NextLink from '../nextLink';
import { cn } from '@/utils';
import { ChevronRightIcon } from 'lucide-react';
import ClickEventTracker from '@/services/analyticsService/clickTracker';
import { useTranslations } from 'next-intl';
import { useIsMobile } from '@/providers/isMobile';

const ViewAllLink = ({
  href,
  title = 'View All',
  hrefTitle,
  className,
  iconClassName,
  gaEvent,
  pageType,
  pageSection,
  ...props
}) => {
  const t = useTranslations('common');
  const isMobile = useIsMobile();
  const linkContent = (
    <NextLink
      className={cn(
        'flex gap-1 text-primary text-xs md:text-sm hover:text-primary lg:font-bold group',
        className,
      )}
      href={href}
      title={hrefTitle || (isMobile ? t('View All') : title)}
      {...props}
    >
      {isMobile ? t('View All') : title}

      <ChevronRightIcon
        className={cn(
          'w-4 h-4 shrink-0 rounded-xs flipX self-center',
          iconClassName,
        )}
      />
    </NextLink>
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

export default ViewAllLink;
