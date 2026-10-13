'use client';

import { cn } from '@/utils';
import FaqRow from './faqRow';
import Text from '@/components/common/text';

// Generic two-column FAQ layout (heading + numbered accordion rows). Copy,
// item data and any analytics callback are page-specific, so they come in
// as props rather than living here.
export default function FaqRowList({ heading, items, onOpenItem, className }) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-20',
        className,
      )}
    >
      <Text
        as="h2"
        weight="bold"
        className="text-4xl leading-[1.05] tracking-tight text-gray-900 md:text-5xl"
      >
        {heading}
      </Text>
      <div>
        {items.map((item, index) => (
          <FaqRow
            key={item.question}
            index={index}
            question={item.question}
            answer={item.answer}
            onOpen={() => onOpenItem?.(item, index)}
          />
        ))}
      </div>
    </div>
  );
}
