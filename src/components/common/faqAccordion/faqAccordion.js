'use client';

import { useLocale } from 'next-intl';
import Accordion from '@/components/common/accordian';
import Text from '@/components/common/text';
import { cn } from '@/utils';
import { useUser } from '@/providers/user';
import { evLandingEvents } from '@/services/analyticsService/events';

export default function FaqAccordion({
  items,
  className,
  cardClassName,
  triggerClassName,
  contentClassName,
  allowMultiple = false,
  trackFaqExpand = false,
}) {
  const locale = useLocale();
  const { user } = useUser();

  if (!items?.length) {
    return null;
  }

  const questionById = {};
  const accordionItems = items.map((item, index) => {
    const id = item.id ?? `faq-${index}`;
    questionById[id] = item.trigger;
    return {
    id,
    trigger: (
      <Text
        as="h3"
        weight="medium"
        className={cn(
          'm-0 min-w-0 flex-1 whitespace-normal break-words text-base leading-6 text-gray-900',
          triggerClassName,
        )}
      >
        {item.trigger}
      </Text>
    ),
    content: (
      <Text
        as="p"
        className={cn(
          'whitespace-normal break-words text-sm leading-6 text-gray-500',
          contentClassName,
        )}
      >
        {item.content}
      </Text>
    ),
    };
  });

  const handleItemOpen = (id) => {
    if (trackFaqExpand) evLandingEvents.faq_expand(locale, user, questionById[id]);
  };

  return (
    <Accordion
      items={accordionItems}
      allowMultiple={allowMultiple}
      onItemOpen={handleItemOpen}
      className={cn('space-y-4', className)}
      itemClassName={cn(
        'rounded-sm border border-gray-200 bg-white px-4 pt-4 shadow-none',
        cardClassName,
      )}
      itemDivider={false}
      headerClassName="h-auto w-full justify-between gap-2 pb-3 pt-0 text-start font-normal hover:bg-transparent"
      chevronClassName="size-4 shrink-0 text-gray-700 duration-200"
      contentClassName="pt-2"
    />
  );
}
