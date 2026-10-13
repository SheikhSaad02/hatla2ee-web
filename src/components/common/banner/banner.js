import { twMerge } from 'tailwind-merge';
import BaseCard from '../baseCard/baseCard';
import Button from '../button/button';
import Text from '../text';
import { cn } from '@/utils';
import NextImage from '../nextImage';
import NextLink from '../nextLink';

export default function Banner({
  title,
  description,
  logo,
  logoPosition = 'left',
  href,
  hrefTitle,
  btnText,
  btnIcon,
  btnIconPosition,
  btnVariant = 'outline',
  className,
  titleClassName,
  descriptionClassName,
  descriptionIcon,
  imageSrc,
}) {
  const content = (
    <BaseCard
      className={twMerge(
        'relative flex items-center gap-4 p-4 md:p-10 transition hover:shadow-md border-0 shadow-none overflow-hidden',
        className,
      )}
    >
      <div className="flex flex-col items-center gap-1 z-10">
        <Text
          as="h3"
          weight="extrabold"
          title={title || hrefTitle}
          className={twMerge('text-2xl', titleClassName)}
        >
          {title}
        </Text>
        <div className="flex items-center gap-1">
          {descriptionIcon && descriptionIcon}
          <Text
            weight="regular"
            className={twMerge('text-lg', descriptionClassName)}
          >
            {description}
          </Text>
        </div>

        {btnText && (
          <Button
            className="w-fit"
            icon={btnIcon}
            variant={btnVariant}
            iconPosition={btnIconPosition}
          >
            {btnText}
          </Button>
        )}
      </div>

      <div
        className={cn(
          'ml-auto md:ml-0 md:absolute md:top-1/2 md:-translate-y-1/2 z-10',
          logoPosition === 'right' ? 'right-6' : 'left-6',
        )}
      >
        {logo}
      </div>
      {imageSrc && (
        <NextImage
          src={imageSrc}
          width={1200}
          height={144}
          priority
          fetchPriority={'high'}
          className={
            'absolute w-full h-full inset-0 object-cover object-bottom-left'
          }
        />
      )}
    </BaseCard>
  );

  return href ? (
    <NextLink href={href} title={hrefTitle} className="block w-full">
      {content}
    </NextLink>
  ) : (
    content
  );
}
