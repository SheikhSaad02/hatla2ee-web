'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';
import Carousel from '@/components/common/carousel/carousel';
import { Button } from '@/components/ui/button';
import Text from '@/components/common/text';
import TestimonialCard from './testimonialCard';
import {
  PAGE_TYPES,
  PAGE_SECTIONS,
} from '@/services/analyticsService/constants';

const ARROW_BUTTON_CLASS =
  'size-14 shrink-0 rounded-full border-gray-200 bg-transparent text-gray-700 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900';

export default function TestimonialsSection({ items }) {
  const t = useTranslations('buyCredits');
  const [api, setApi] = useState(null);
  const [selected, setSelected] = useState(0);
  const sectionRef = useRef(null);

  const autoplay = useMemo(
    () =>
      Autoplay({
        delay: 3500,
        // Reset the countdown on interaction rather than cancelling autoplay.
        stopOnInteraction: false,
        stopOnMouseEnter: false,
        stopOnFocusIn: true,
        playOnInit: false,
      }),
    [],
  );
  const plugins = useMemo(() => [autoplay], [autoplay]);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelected(api.selectedScrollSnap());
    onSelect();
    api.on('select', onSelect);
    return () => api.off('select', onSelect);
  }, [api]);

  // The viewport gate the plugin does not provide, plus reduced motion.
  useEffect(() => {
    if (!api) return undefined;

    const player = api.plugins()?.autoplay;
    if (!player) return undefined;

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      player.stop();
      return undefined;
    }

    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? player.play() : player.stop()),
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [api]);

  if (!items?.length) return null;

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      data-testimonials
      className="scroll-mt-28"
    >
      <div className="py-16 lg:py-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:items-stretch lg:gap-14">
          <div className="flex flex-col">
            <Text
              as="h2"
              weight="semibold"
              className="pb-3 text-[32px] leading-[1.1] tracking-tight text-gray-900 md:text-[40px]"
            >
              {t('testimonials.heading')}
            </Text>
            <div className="mt-8 flex items-center gap-3 lg:mt-auto lg:pt-10">
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label={t('testimonials.prev')}
                onClick={() => api?.scrollPrev()}
                className={ARROW_BUTTON_CLASS}
              >
                <ArrowRight
                  className="size-5 rotate-180 rtl:rotate-0"
                  strokeWidth={2}
                />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label={t('testimonials.next')}
                onClick={() => api?.scrollNext()}
                className={ARROW_BUTTON_CLASS}
              >
                <ArrowRight className="size-5 rtl:rotate-180" strokeWidth={2} />
              </Button>
              <span
                dir="ltr"
                className="ms-2 text-sm tabular-nums text-gray-500"
              >
                {t('testimonials.counter', {
                  current: String(selected + 1).padStart(2, '0'),
                  total: String(items.length).padStart(2, '0'),
                })}
              </span>
            </div>
          </div>

          <Carousel
            setApi={setApi}
            plugins={plugins}
            carouselOpts={{ align: 'start', dragFree: false, duration: 20 }}
            showArrows={false}
            itemClassName="ps-6"
            pageType={PAGE_TYPES.CREDITS_LANDING}
            pageSection={PAGE_SECTIONS.TESTIMONIALS}
          >
            {items.map((item, index) => (
              <TestimonialCard
                key={item.id ?? index}
                item={item}
                active={index === selected}
              />
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
}
