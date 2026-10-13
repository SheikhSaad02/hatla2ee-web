'use client';

import { useLocale } from 'next-intl';
import { useActiveProduct } from '@/hooks/useActiveProduct';

// Four blurred, tinted ellipses cross-fading behind the product blocks as the
// active product changes on scroll. They bleed off the block's leading edge —
// left in English, right in Arabic, since a directional gradient must flip.
const ELLIPSES = [
  { y: '2%', w: 780, h: 620, cx: 30, a: 0.182 },
  { y: '32%', w: 900, h: 780, cx: 50, a: 0.14 },
  { y: '60%', w: 820, h: 700, cx: 40, a: 0.119 },
  { y: '88%', w: 680, h: 540, cx: 30, a: 0.098 },
];

const toAlphaHex = (alpha) =>
  Math.round(Math.max(0, Math.min(1, alpha)) * 255)
    .toString(16)
    .padStart(2, '0');

function buildGradient(color, rtl) {
  return ELLIPSES.map(({ y, w, h, cx, a }) => {
    const position = rtl ? `calc(100% + ${cx}px)` : `-${cx}px`;
    return `radial-gradient(ellipse ${w}px ${h}px at ${position} ${y}, ${color}${toAlphaHex(a)} 0%, ${color}${toAlphaHex(a * 0.45)} 46%, ${color}00 88%)`;
  }).join(', ');
}

export default function ProductGlow({ products }) {
  const locale = useLocale();
  const rtl = locale !== 'en';
  const productIds = products.map((p) => p.id);
  const activeId = useActiveProduct(productIds);
  const glowColors = [...new Set(products.map((p) => p.glow).filter(Boolean))];

  if (!glowColors.length) return null;

  const activeGlow = products.find((p) => p.id === activeId)?.glow;

  return (
    <div
      className="pointer-events-none sticky top-0 z-0 h-0"
      aria-hidden="true"
    >
      <div className="absolute inset-x-0 top-0 h-screen overflow-hidden">
        {glowColors.map((color) => (
          <div
            key={color}
            className="absolute inset-0 blur-[64px] transition-opacity duration-[900ms]"
            style={{
              backgroundImage: buildGradient(color, rtl),
              opacity: activeGlow === color ? 1 : 0,
              willChange: 'opacity',
            }}
          />
        ))}
      </div>
    </div>
  );
}
