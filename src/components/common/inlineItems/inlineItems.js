'use client';

import { cn } from '@/utils';
import NextLink from '../nextLink';
import { Separator } from '@/components/ui/separator';
import { getLocaleString } from '@/utils/general';
import { translations } from '@/data/tFunctionTranslation';
import { useRef, useState, useEffect } from 'react';

function SingleLineWithDots({ className, content }) {
  const containerRef = useRef(null);
  const [showDots, setShowDots] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const checkOverflow = () => {
      const itemsEl = el.querySelector('[data-inline-items-content]');
      if (!itemsEl) return;
      setShowDots(itemsEl.scrollWidth > itemsEl.clientWidth);
    };

    checkOverflow();

    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(el);

    return () => resizeObserver.disconnect();
  }, [content]);

  return (
    <div
      ref={containerRef}
      className={cn(className, 'flex min-w-0 items-center overflow-hidden')}
    >
      <div
        data-inline-items-content
        className="flex min-w-0 flex-1 flex-nowrap items-center overflow-hidden"
      >
        {content}
      </div>
      {showDots && <span className="shrink-0 text-gray-400">...</span>}
    </div>
  );
}

function InlineItems({
  items = [],
  separator,
  spaceClass,
  className = '',
  locale,
  singleLine = false,
}) {
  if (!Array.isArray(items) || items.length === 0) return null;

  const content = (
    <>
      {items.map((item, index) => {
        const { href, icon } = typeof item === 'object' ? item : {};
        const isLast = index === items.length - 1;

        let label;
        if (item?.slug && item?.label && translations?.[locale]?.[item.slug]) {
          label = translations[locale][item.slug](item.label);
        } else {
          label = getLocaleString(item, 'label', locale);
        }

        if (!label) return null;

        const contentClassName =
          singleLine && isLast ? 'block min-w-0 truncate' : '';

        return (
          <div
            key={index}
            className={cn(
              'flex items-center',
              spaceClass,
              singleLine && !isLast && 'shrink-0',
              singleLine && isLast && 'min-w-0 overflow-hidden',
            )}
          >
            {icon && <div className="shrink-0 flex w-4">{icon}</div>}
            {href ? (
              <NextLink
                href={href}
                title={item?.hrefTitle}
                className={cn('hover:underline', contentClassName)}
              >
                {label}
              </NextLink>
            ) : (
              <span className={contentClassName}>{label}</span>
            )}
            {!isLast &&
              (separator || (
                <Separator variant="dot" className="shrink-0 bg-gray-400" />
              ))}
          </div>
        );
      })}
    </>
  );

  if (singleLine) {
    return <SingleLineWithDots className={className} content={content} />;
  }

  return (
    <div className={cn('flex flex-wrap items-center', className)}>
      {content}
    </div>
  );
}

export default InlineItems;
