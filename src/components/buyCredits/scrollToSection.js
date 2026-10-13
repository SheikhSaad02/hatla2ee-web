'use client';

import { useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { useUser } from '@/providers/user';
import { buyCreditsEvents } from '@/services/analyticsService/events';

// Small client island so the sections around it stay server components.
// `trackAs` names a handler on buyCreditsEvents; callers are server components,
// so the event is selected by name rather than passed in as a function.
export default function ScrollToSection({
  target,
  trackAs,
  children,
  ...props
}) {
  const locale = useLocale();
  const { user } = useUser();

  const handleClick = () => {
    if (trackAs) {
      buyCreditsEvents[trackAs]?.(locale, user);
    }
    document
      .getElementById(target)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Button type="button" onClick={handleClick} {...props}>
      {children}
    </Button>
  );
}
