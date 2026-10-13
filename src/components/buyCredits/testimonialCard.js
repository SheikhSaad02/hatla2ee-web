import { MapPin } from 'lucide-react';
import NextImage from '@/components/common/nextImage';
import Text from '@/components/common/text';
import TextWithIcon from '@/components/common/textWithIcon/textWithIcon';
import { getAsset } from '@/utils/general';

// Same fallback the showroom cards use for an agency with no logo.
const LOGO_PLACEHOLDER = getAsset('/assets/showroom-placeholder-image.png');

// Dimmed until selected: `data-spotlight` on the <figure> drives every change
// through the `spotlight` variant in globals.css.
const styles = {
  card: 'flex min-h-[300px] w-[86vw] max-w-[500px] flex-col rounded-3xl bg-surface-lightest p-6 transition-all duration-500 sm:min-h-[360px] sm:p-8 lg:min-h-[460px] lg:p-10 spotlight:bg-white spotlight:shadow-xl spotlight:shadow-gray-900/5 spotlight:ring-1 spotlight:ring-gray-200/70',
  mark: 'fade-500 inline-block origin-top-left rotate-6 font-serif text-7xl leading-[0.6] text-gray-300 rtl:origin-top-right rtl:-rotate-6 sm:text-8xl spotlight:text-secondary',
  quote:
    'fade-500 mt-5 text-lg leading-relaxed text-gray-400 sm:mt-8 sm:text-2xl lg:text-[26px] spotlight:text-gray-900',
  caption: 'mt-auto flex items-center gap-3 pt-6 sm:gap-4 sm:pt-10',
  logo: 'relative size-12 shrink-0 overflow-hidden rounded-2xl bg-white opacity-50 ring-1 ring-gray-200 transition-opacity duration-500 sm:size-16 spotlight:opacity-100',
  name: 'fade-500 truncate text-base text-gray-400 sm:text-lg spotlight:text-gray-900',
  location: 'fade-500 mt-0.5 gap-1.5 text-gray-400 spotlight:text-gray-500',
};

export default function TestimonialCard({ item, active }) {
  return (
    <figure
      data-spotlight={active}
      aria-hidden={!active}
      className={styles.card}
    >
      <div aria-hidden="true" className={styles.mark}>
        &ldquo;
      </div>

      <Text as="blockquote" weight="medium" className={styles.quote}>
        {item.quote}
      </Text>

      <figcaption className={styles.caption}>
        <div className={styles.logo}>
          <NextImage
            src={item.logo || LOGO_PLACEHOLDER}
            alt=""
            fill
            sizes="(min-width: 640px) 64px, 48px"
            className="object-contain"
          />
        </div>
        <div className="min-w-0">
          <Text as="div" weight="bold" className={styles.name}>
            {item.name}
          </Text>
          {item.location && (
            <TextWithIcon
              icon={<MapPin className="size-4" aria-hidden="true" />}
              description={item.location}
              className={styles.location}
              contentClassName="min-w-0"
              descriptionClassName="truncate text-sm"
            />
          )}
        </div>
      </figcaption>
    </figure>
  );
}
