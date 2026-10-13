'use client';
import { useEffect, useState } from 'react';

// Tracks which product block is "active" (in the middle 10% of the
// viewport) by id, looking elements up by `product-${id}` so the product
// blocks themselves stay plain server-rendered markup.
export function useActiveProduct(productIds) {
  const [activeId, setActiveId] = useState(productIds[0]);
  const idsKey = productIds.join(',');

  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const entries = productIds
      .map((id) => ({ id, el: document.getElementById(`product-${id}`) }))
      .filter((entry) => entry.el);
    if (!entries.length) return;

    const observer = new IntersectionObserver(
      (observed) => {
        const hit = observed.find((entry) => entry.isIntersecting);
        if (!hit) return;
        const match = entries.find((entry) => entry.el === hit.target);
        if (match) setActiveId(match.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );

    entries.forEach(({ el }) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey]);

  return activeId;
}
