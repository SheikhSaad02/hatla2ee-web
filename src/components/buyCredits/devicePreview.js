'use client';

import { cn } from '@/utils';
import { useActiveProduct } from '@/hooks/useActiveProduct';
import { useAdAnimation } from '@/hooks/useAdAnimation';
import DeviceFrame from './deviceFrame';

const ROW_SHIFT = {
  silver: '-translate-y-[29.2%] md:translate-y-0',
  premium: '-translate-y-[5.3%] md:translate-y-0',
  turbo: '',
  pump: '',
};

// The element a clip renders into; useAdAnimation owns its whole lifecycle.
function AdAnimation({ productId, nextProductId, className }) {
  const containerRef = useAdAnimation({ productId, nextProductId });
  return <div ref={containerRef} className={className} />;
}

// Desktop: one sticky preview, following the active product.
export function DevicePreview({ products, className }) {
  const productIds = products.map((p) => p.id);
  const activeId = useActiveProduct(productIds);
  const activeIndex = Math.max(productIds.indexOf(activeId), 0);
  const nextId = productIds[(activeIndex + 1) % productIds.length];

  return (
    <div className={className} aria-hidden="true">
      <DeviceFrame productId={activeId}>
        <AdAnimation
          productId={activeId}
          nextProductId={nextId}
          className="aspect-[568/480] h-full max-w-none"
        />
      </DeviceFrame>
    </div>
  );
}

// Mobile: one inline preview per product.
export function InlineDevicePreview({ productId, className }) {
  return (
    <div className={className} aria-hidden="true">
      <DeviceFrame
        productId={productId}
        screenAspectClass="aspect-[420/340] md:aspect-[568/480]"
      >
        <AdAnimation
          productId={productId}
          className={cn(
            'aspect-[568/480] w-[135.24%] max-w-none md:h-full md:w-auto',
            ROW_SHIFT[productId],
          )}
        />
      </DeviceFrame>
    </div>
  );
}
