'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import AutoScroll from 'embla-carousel-auto-scroll';
import Carousel from '@/components/common/carousel/carousel';
import ShowroomCard from './showroomCard';

// ~110px/s. The plugin counts px per frame, hence 110 / 60fps.
const SCROLL_SPEED = 1.8;

export default function ShowroomsCarousel({ showrooms }) {
  const t = useTranslations('buyCredits');
  const [api, setApi] = useState(null);
  const sectionRef = useRef(null);
  const hoveredRef = useRef(false);

  const plugins = useMemo(
    () => [
      AutoScroll({
        speed: SCROLL_SPEED,
        startDelay: 0,
        // A drag repositions the strip without cancelling the scroll.
        stopOnInteraction: false,
        playOnInit: false,
        stopOnMouseEnter: true,
        stopOnFocusIn: true,
      }),
    ],
    [],
  );

  // Scroll only while on screen, and never under reduced motion.
  useEffect(() => {
    const player = api?.plugins()?.autoScroll;
    const el = sectionRef.current;
    if (!player || !el) return undefined;

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      player.stop();
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) =>
        entry.isIntersecting && !hoveredRef.current
          ? player.play()
          : player.stop(),
      { threshold: 0.2 },
    );

    observer.observe(el);

    const handleMouseEnter = () => {
      hoveredRef.current = true;
    };
    const handleMouseLeave = () => {
      hoveredRef.current = false;
    };
    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      observer.disconnect();
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [api]);

  return (
    <div ref={sectionRef} className="relative mt-10">
      <Carousel
        setApi={setApi}
        plugins={plugins}
        carouselOpts={{ loop: true }}
        showArrows={false}
        itemBasis="basis-auto"
        itemClassName="pl-6"
        contentClassName="-ml-6"
      >
        {showrooms.map((showroom) => (
          <ShowroomCard key={showroom.id} showroom={showroom} t={t} />
        ))}
      </Carousel>

      {/* ui/carousel clips 6px outside this wrapper (p-1.5 -m-1.5), so the
          fades start there too, otherwise a sliver of card shows past them. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-y-1.5 -start-1.5 w-24 bg-gradient-to-r from-white to-transparent rtl:bg-gradient-to-l md:w-40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-y-1.5 -end-1.5 w-24 bg-gradient-to-l from-white to-transparent rtl:bg-gradient-to-r md:w-40"
      />
    </div>
  );
}
