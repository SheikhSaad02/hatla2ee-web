import Text from '../text';
import { cn } from '@/utils';
import { twMerge } from 'tailwind-merge';
import NextImage from '../nextImage';
import InlineItems from '../inlineItems/inlineItems';
import NextLink from '../nextLink';

const ImageWithContent = ({
  href,
  hrefTitle,
  title,
  description,
  imgSrc,
  imgPos = 'left',
  imageProps = {}, // width, height, wrapperClassName, imageClassName, alt, etc.
  className,
  contentClassName,
  titleClassName,
  descriptionClassName,
}) => {
  const {
    wrapperClassName,
    imgClassName,
    alt = 'Image',
    ...restImageProps
  } = imageProps;

  return (
    <div
      className={cn(
        'flex items-center gap-4',
        imgPos === 'right' && 'flex-row-reverse',
        className,
      )}
    >
      {imgSrc && (
        <div className={cn('relative shrink-0', wrapperClassName)}>
          <NextImage
            src={imgSrc}
            alt={alt}
            fill
            className={cn(imgClassName)}
            {...restImageProps}
          />
        </div>
      )}

      <div className={cn('flex flex-col w-full items-start', contentClassName)}>
        <Text weight="semibold" className={twMerge('text-sm', titleClassName)}>
          {href ? (
            <NextLink
              href={href}
              title={hrefTitle || title}
              className={'text-primary'}
            >
              {title}
            </NextLink>
          ) : (
            title
          )}
        </Text>
        {Array.isArray(description) ? (
          <InlineItems
            items={description}
            className={cn('text-xs text-gray-500', descriptionClassName)}
          />
        ) : typeof description === 'string' ? (
          <Text
            weight="regular"
            className={twMerge('text-xs text-gray-500', descriptionClassName)}
          >
            {description}
          </Text>
        ) : (
          description
        )}
      </div>
    </div>
  );
};

export default ImageWithContent;
