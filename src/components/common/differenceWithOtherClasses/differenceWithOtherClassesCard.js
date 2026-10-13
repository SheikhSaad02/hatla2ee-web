import { CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ChevronArrowBubble, RightArrowFilled } from '@/icons';
import { cn } from '@/utils';
import { getTranslations } from 'next-intl/server';
import BaseCard from '../baseCard/baseCard';
import NextImage from '../nextImage';
import ListWithTitle from '../listWithTitle/listWithTitle';
import Price from '../price/price';
import Button from '../button/button';
import LinkWithIcon from '../linkWithIcon/linkWithIcon';
import { getListingTitleByLevel } from '@/utils/listings';
import { IconTick } from '@/icons/basicSvgs';

export default async function DifferenceWithOtherClassesCard({
  href = '#',
  item,
  img,
  price,
  className,
  features,
}) {
  const t = await getTranslations('common');
  const isActive = false;
  const displayedFeatures = features.slice(0, 12);
  const title = await getListingTitleByLevel(item, 'variant');

  return (
    <BaseCard
      className={cn(
        'card group hover:border-primary-600 hover:shadow-sm',
        'flex flex-col p-0 gap-0',
        className,
      )}
    >
      <CardHeader className="p-3">
        <LinkWithIcon
          title={title}
          href={href}
          titleClassName="sm:text-sm text-base mb-1 group-hover:text-primary"
          icon={
            <span className="opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1">
              <ChevronArrowBubble />
            </span>
          }
          iconPosition="right"
          className="flex-1 min-w-0"
        />
        <Price style="uniform" value={price} />
      </CardHeader>

      <CardContent className="relative aspect-[2/1] overflow-hidden">
        <div className="absolute top-0 lg:ltr:right-[-40px] lg:rtl:left-[-40px] h-full w-[210px] transition-transform duration-300 group-hover:lg:-translate-x-[40px] group-hover:lg:rtl:translate-x-[40px] flipX">
          <NextImage
            src={img}
            alt="Image"
            width={210}
            height={156}
            className={'w-full h-full'}
          />
        </div>
      </CardContent>

      <CardFooter
        className="flex flex-col flex-1 gap-3 p-3
        bg-gradient-to-t from-[#F4F8FD] to-white
        group-hover:from-[#E8F1FC] group-hover:to-white
        transition-colors duration-300"
      >
        {displayedFeatures?.length ? (
          <ListWithTitle
            titleClassName="text-xs md:text-sm font-bold"
            labelClassName="text-xs md:text-sm"
            items={displayedFeatures}
            title={t('Features')}
            icon={<IconTick size={12} color="#009f2b" />}
          />
        ) : (
          <> {t('No data available')}</>
        )}
        {features?.length > 12 && (
          <Button
            href={href}
            size="lg"
            variant="primaryLight"
            className="bg-white inset-ring inset-ring-primary-500"
          >
            {t('View More')}
          </Button>
        )}
      </CardFooter>
    </BaseCard>
  );
}
