'use client';
import { carMaintenanceEvents, homeClickEvents } from './events';
import { useUser } from '@/providers/user';
import { useLocale } from 'next-intl';
import { usePageType } from '@/hooks/usePageType';

const EVENT_GROUPS = {
  home: homeClickEvents,
  carMaintenance: carMaintenanceEvents,
};

export default function ClickEventTracker({
  gaEvent,
  eventGroup = 'home',
  children,
  pageType = '',
  pageSection = '',
  ...rest
}) {
  const { user } = useUser();
  const locale = useLocale();
  const detectedPageType = usePageType();
  const events = EVENT_GROUPS[eventGroup] || homeClickEvents;

  return (
    <span
      onClickCapture={() =>
        events?.[gaEvent]?.(
          locale,
          user,
          pageType || detectedPageType,
          pageSection,
          rest,
        )
      }
      style={{ display: 'contents' }}
    >
      {children}
    </span>
  );
}
