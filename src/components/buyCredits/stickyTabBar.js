'use client';

import { useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { cn } from '@/utils';
import { Button } from '@/components/ui/button';
import ScrollArea from '@/components/common/scrollArea';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { useUser } from '@/providers/user';
import { buyCreditsEvents } from '@/services/analyticsService/events';

// The page resolves the tab list server-side (the conditional "Trusted
// Sellers" target lives there); this only renders what it's given.
export default function StickyTabBar({ tabs, ariaLabel, isWebView = false }) {
  const sectionIds = tabs.map((tab) => tab.target);
  const { activeId, isVisible } = useScrollSpy(sectionIds, {
    offset: 160,
    visibilityRatio: 0.55,
  });
  const activeRef = useRef(null);
  const locale = useLocale();
  const { user } = useUser();

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      block: 'nearest',
      inline: 'center',
      behavior: 'smooth',
    });
  }, [activeId]);

  const handleTabClick = (target) => {
    // The spec records only that the floating nav was used, not which tab.
    buyCreditsEvents.tab_click(locale, user);
    document
      .getElementById(target)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav
      aria-label={ariaLabel}
      inert={!isVisible}
      className={cn(
        'pointer-events-none fixed inset-x-0 z-50 flex justify-center px-4 transition-[opacity,transform] duration-300 ease-out',
        isWebView ? 'top-3' : 'top-[52px]',
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0',
      )}
    >
      <ScrollArea
        orientation="horizontal"
        className={cn(
          'flex max-w-full items-center gap-1 rounded-full bg-white/85 p-1.5 shadow-lg shadow-gray-900/10 ring-1 ring-gray-200/70 backdrop-blur-md',
          isVisible && 'pointer-events-auto',
        )}
      >
        {tabs.map((tab) => {
          const isActive = tab.target === activeId;
          return (
            <Button
              key={tab.target}
              type="button"
              size="pill"
              variant={isActive ? 'pillActive' : 'pillInactive'}
              ref={isActive ? activeRef : undefined}
              aria-current={isActive ? 'true' : undefined}
              onClick={() => handleTabClick(tab.target)}
            >
              {tab.label}
            </Button>
          );
        })}
      </ScrollArea>
    </nav>
  );
}
