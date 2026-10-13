import React from 'react';
import BaseCard from '../baseCard/baseCard';
import { CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import LinkWithIcon from '../linkWithIcon/linkWithIcon';
import NextImage from '../nextImage';
import { cn } from '@/utils';
import { ChevronArrowBubble } from '@/icons';
import { Star } from 'lucide-react';
import Text from '../text';
import { ImageCarousel } from '../imageCarousel/imageCarousel';
import NextLink from '../nextLink';
import { extractImageUrls } from '@/utils/general';

const ReviewCard = ({ className, href, title, images, yearRange, rating }) => {
  const limitedImages = extractImageUrls(images).slice(0, 3);

  return (
    <BaseCard
      className={cn(
        'flex flex-col h-full gap-0 p-0 box-border',
        'card group hover:shadow-sm',
        className,
      )}
    >
      <div className="relative p-0 m-0">
        <NextLink title={title} href={href} className="no-underline">
          <ImageCarousel
            carouselOpts={{ loop: false }}
            showArrows={images?.length > 1 ? true : false}
            showItemCount={true}
            images={limitedImages}
            totalImageCount={images?.length}
            carouselClassName="object-cover w-full h-full transition-transform duration-300"
          />
        </NextLink>
      </div>

      <CardContent className="my-0 p-3 lg:pb-0 h-full flex-1">
        <NextLink title={title} href={href} className="no-underline">
          <Text className="fs-body block mb-0.5" weight="semibold">
            {title}
          </Text>
        </NextLink>
      </CardContent>
      <CardFooter
        className="flex gap-1 items-center p-2 md:p-3 bg-[linear-gradient(to_top,var(--color-primary-200)_0%,_white_100%)] rtl:justify-end"
        dir="ltr"
      >
        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
        <Text className="font-bold text-2xl">{rating}</Text>
        <Text className="text-dim font-medium text-lg self-end">/5</Text>
      </CardFooter>
    </BaseCard>
  );
};

export default ReviewCard;
