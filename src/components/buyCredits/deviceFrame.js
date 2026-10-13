import styles from './deviceFrame.module.css';

// Per-product rotating borders. Silver has none.
const BORDER_GRADIENTS = {
  turbo: {
    gradient:
      'conic-gradient(from 0deg, #1C6FF8, #38BDF8, #EAF1F8, #FDBA74, #F97316, #FB5D0A, #1C6FF8)',
    duration: '9s',
    delay: '1s',
  },
  pump: {
    gradient:
      'conic-gradient(from 0deg, #3160A5, #7CA3E0, #C7D7EE, #3160A5, #13253F, #3160A5)',
    duration: '12s',
    delay: '0s',
  },
};

// Premium's thinner gold sweep, on the frame rather than outside it.
const PREMIUM_SWEEP =
  'conic-gradient(from 0deg, transparent 0deg, transparent 296deg, #F7D319 330deg, #FFF6CC 344deg, #F7D319 358deg, transparent 360deg)';

function SpinningRing({ gradient, duration, delay, thin, className }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute overflow-hidden ${thin ? styles.ringThin : styles.ring} ${className}`}
    >
      <div
        className={`absolute inset-[-50%] transform-gpu ${styles.sweep}`}
        style={{
          background: gradient,
          '--spin-duration': duration,
          '--spin-delay': delay,
        }}
      />
    </div>
  );
}

// Outer frame, a tablet bezel bleeding off its leading edge, and the screen
// the animation renders into.
export default function DeviceFrame({
  productId,
  screenAspectClass = 'aspect-[568/480]',
  children,
}) {
  const border = BORDER_GRADIENTS[productId];
  const isPremium = productId === 'premium';

  return (
    <div className="relative">
      {border && (
        <SpinningRing
          gradient={border.gradient}
          duration={border.duration}
          delay={border.delay}
          className="-inset-px rounded-[26px]"
        />
      )}

      <div
        className={`relative overflow-hidden rounded-3xl bg-surface-lightest ps-[8%] pt-[10%] ${
          isPremium ? 'ring-1 ring-secondary/50' : 'ring-1 ring-black/[0.06]'
        }`}
      >
        {isPremium && (
          <SpinningRing
            gradient={PREMIUM_SWEEP}
            duration="3.6s"
            delay="0s"
            thin
            className="inset-0 rounded-3xl"
          />
        )}

        <div className="relative ps-3.5 pt-3.5">
          <div
            aria-hidden="true"
            className="absolute start-0 top-0 h-[300%] w-[130%] rounded-[34px] bg-gray-900 shadow-[0_40px_80px_-30px_rgba(19,37,63,0.5)] ring-1 ring-black/20"
          />
          <div
            className={`relative w-full overflow-hidden rounded-ss-[22px] bg-surface-lightest ps-3 ring-1 ring-black/5 ${screenAspectClass}`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
