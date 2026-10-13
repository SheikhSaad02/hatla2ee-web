import NextImage from '../nextImage';
import { cn } from '@/utils';

export default function FeatureCard({
  image,
  imageAlt,
  imageWidth = 320,
  imageHeight = 200,
  title,
  description,
  className,
  imageClassName,
  imageWrapperClassName,
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 md:gap-6 pb-3 md:pb-6 h-full',
        'bg-[#F7F9FA] rounded-xl md:rounded-2xl overflow-hidden',
        className,
      )}
    >
      <div
        className={cn(
          'w-full flex items-center justify-center',
          'h-[130px] md:h-[210px]',
          'bg-[linear-gradient(180deg,#FFFFFF_0%,#EFF4FB_100%)]',
          imageWrapperClassName,
        )}
      >
        {image && (
          <NextImage
            src={image}
            alt={imageAlt || title}
            width={imageWidth}
            height={imageHeight}
            className={cn('h-full w-auto object-contain', imageClassName)}
          />
        )}
      </div>

      <div className="flex flex-col gap-1 px-4">
        {title && (
          <h3 className="text-sm md:text-base font-bold text-gray-900">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-xs md:text-sm text-gray-500">{description}</p>
        )}
      </div>
    </div>
  );
}
