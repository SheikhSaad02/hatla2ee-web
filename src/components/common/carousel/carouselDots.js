import React from 'react';
import { useCarousel } from '@/components/ui/carousel';

const CarouselDots = React.forwardRef((props, ref) => {
  const { api } = useCarousel();
  const [current, setCurrent] = React.useState(0);
  const [total, setTotal] = React.useState(0);

  const updateState = React.useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    setTotal(api.scrollSnapList().length);
  }, [api]);

  React.useEffect(() => {
    if (api) {
      updateState();
      api.on('select', updateState);
      api.on('reInit', updateState);
      return () => {
        api.off('select', updateState);
        api.off('reInit', updateState);
      };
    }
  }, [api, updateState]);

  if (total <= 1) return null;

  return (
    <div
      ref={ref}
      className="absolute bottom-[-14px] md:bottom-[-24px] left-1/2 -translate-x-1/2 w-12 h-1 bg-primary/10 rounded-full flex overflow-hidden z-10"
    >
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          onClick={() => api?.scrollTo(i)}
          className={`h-full transition-all duration-300 cursor-pointer ${
            i === current && 'bg-primary'
          }`}
          style={{ width: `${100 / total}%` }}
        />
      ))}
    </div>
  );
});

CarouselDots.displayName = 'CarouselDots';

export default CarouselDots;
