import { getAsset } from '@/utils/general';

const VIDEO_SRC = getAsset('/assets/buy-credits/coin-spin.mp4');
const POSTER_SRC = getAsset('/assets/buy-credits/coin-poster.webp');

// The coin ships as a looped, muted video rather than the CSS-3D route first
// spec'd. No client JS: autoplay/loop/muted are native, and reduced motion is a
// CSS swap (motion-reduce:) to a poster, so this stays a server component.
export default function CreditsCoinVideo({ className }) {
  return (
    <div className={className} aria-hidden="true">
      <video
        className="motion-reduce:hidden size-full object-contain"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={POSTER_SRC}
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>
      <img
        className="hidden size-full object-contain motion-reduce:block"
        src={POSTER_SRC}
        alt=""
        loading="lazy"
      />
    </div>
  );
}
