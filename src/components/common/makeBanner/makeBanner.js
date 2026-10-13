import { twMerge } from 'tailwind-merge';
import BaseCard from '../baseCard/baseCard';
import NextImage from '../nextImage';
import Text from '../text';
import { CardContent } from '@/components/ui/card';
import Button from '../button/button';
import { IconExternalLink } from '@/icons/basicSvgs';
import { cn } from '@/utils';
import { isMobileServer } from '@/utils/serverFunctions';
import ScrollArea from '../scrollArea';

export default async function MakeBanner({
  slug,
  title,
  description,
  links = [],
  logo,
  className,
  titleClassName,
  titleTag,
  descriptionClassName,
  src,
}) {
  const isMob = await isMobileServer();

  return (
    <BaseCard
      className={twMerge(
        'bg-gradient-to-b from-white to-primary-200 md:py-5 md:px-6 gap-3 md:gap-5',
        className,
        isMob && 'border-none rounded-none breakout px-4 pb-3',
      )}
    >
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,_1fr)_76px] md:gap-6">
          <div className="flex flex-col gap-3 md:gap-4 flex-1">
            {(title || logo) && (
              <div className="flex justify-between items-center">
                <Text
                  as={titleTag || 'h2'}
                  className={twMerge('sectionHeading mb-0', titleClassName)}
                >
                  {title}
                </Text>
                {isMob && src && <NextImage src={src} width={46} height={46} />}
              </div>
            )}

            {description && (
              <Text
                as="div"
                className={cn(
                  'text-sm whitespace-pre-line',
                  descriptionClassName,
                )}
              >
                {description}
              </Text>
            )}

            {links.length > 0 && (
              <ScrollArea
                orientation={'horizontal'}
                className={cn('py-2.5 -my-2.5')}
              >
                <div className="flex gap-2.5">
                  {links.map((item, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      href={item?.href}
                      title={item?.hrefTitle || item?.label}
                      size="sm"
                      className="text-gray-700 items-center hover:border-primary-400 hover:shadow-[0_0_10px_#0000001C] [&_svg:not([class*='size-'])]:!size-[10px]"
                      icon={item?.isExternal && <IconExternalLink />}
                      iconPosition="right"
                    >
                      {item?.label}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
          {!isMob && src && (
            <div className="shrink-0 w-[76px] h-[76px] flex items-center justify-center">
              {<NextImage src={src} width={76} height={76} />}
            </div>
          )}
        </div>
      </CardContent>
    </BaseCard>
  );
}
