import CarouselSection from '@/components/common/carouselSection/carouselSection';
import { cn } from '@/utils';
import { getLocaleString } from '@/utils/general';
import { ChipWithIcon } from '../chip-with-icon/chip-with-icon';
import NextImage from '../nextImage';
import NextLink from '../nextLink';
import OptionCard from '../optionCard/optionCard';
import { chunkItems } from './carouselFunctions';
import { parentClasses } from '@/data/listings/used-cars/spriteMapping';
import { useTranslations } from 'next-intl';
import { getAsset } from '@/utils/general';

export const MultilineCarousel = ({
  items = [],
  chunks: externalChunks,
  rows = 3,
  threshold = 18,
  renderItem,
  itemBasis,
  locale,
  itemClassname,
  iconClassName,
  getLinkTitle = () => { },
  gridClassName,
  showArrows = true,
  showDots = false,
  type = 'chip',
  subLabelClassName,
  contentClassName,
}) => {
  const showCarousel = items.length > threshold;
  const chunks =
    externalChunks ?? showCarousel ? chunkItems(items, rows) : items;

  const commonT = useTranslations('common');
  // Get type-specific configuration
  const typeConfig = getUITypeConfig(type);

  // Configuration for different UI types
  function getUITypeConfig(type = 'chip') {
    const config = {
      chip: {
        itemBasis: 'basis-[50%] md:basis-[27%] lg:basis-[21%] xl:basis-[18%]',
        gridClassName: 'grid-cols-[repeat(auto-fill,minmax(180px,1fr))]',
        itemClassname: 'text-center whitespace-normal',
      },
      optionCard: {
        itemBasis: 'basis-[27.5%] lg:basis-[15.9%] xl:basis-[9.3%]',
        gridClassName: 'grid-cols-[repeat(auto-fill,minmax(100px,1fr))]',
        itemClassname: 'text-center whitespace-normal',
      },
    };
    return config[type] || config.chip;
  }

  function renderChip(item, index) {
    return (
      <ChipWithIcon
        key={item?.slug || index}
        href={item?.href || `/car/${item?.slug}`}
        hrefTitle={
          getLinkTitle(item) ||
          getLocaleString(item, 'hrefTitle', locale) ||
          getLocaleString(item, 'label', locale)
        }
        label={getLocaleString(item, 'label', locale, commonT)}
        icon={
          item?.image ? (
            <NextImage
              src={item?.image}
              width={20}
              height={20}
              className="object-contain"
              alt="Logo"
            />
          ) : (
            item?.icon
          )
        }
        iconClassName={iconClassName}
        className={cn(
          'justify-center capitalize items-center',
          itemClassname || typeConfig.itemClassname,
        )}
      />
    );
  }

  function renderOptionCard(item, index) {
    return (
      <NextLink
        title={
          getLinkTitle(item) ||
          getLocaleString(item, 'hrefTitle', locale) ||
          getLocaleString(item, 'label', locale)
        }
        href={item?.href ? item?.href : `/car/${item?.label}`}
        key={index}
      >
        <OptionCard
          key={index}
          width={100}
          height={100}
          image={
            item?.image ? item?.image : getAsset('/assets/car-placeholder.svg')
          }
          imageClassName="w-auto h-[50px] flex-shrink-0"
          label={
            item?.labelText
              ? item?.labelText
              : getLocaleString(item, 'label', locale, commonT)
          }
          subLabel={item?.doc_count}
          subLabelClassName={subLabelClassName}
          contentClassName={contentClassName}
          src={item?.src}
        />
      </NextLink>
    );
  }

  return showCarousel ? (
    <CarouselSection
      itemBasis={itemBasis || typeConfig.itemBasis}
      showArrows={showArrows}
      showDots={showDots}
    >
      {chunks?.map((chunk, slideIndex) => (
        <div
          key={chunk?.key || slideIndex}
          className={cn('flex flex-col gap-3 flex-wrap')}
        >
          {chunk?.items?.map((item, index) =>
            renderItem
              ? renderItem(item, index)
              : type == 'chip'
                ? renderChip(item, index)
                : renderOptionCard(item, index),
          )}
        </div>
      ))}
    </CarouselSection>
  ) : (
    <div
      className={cn('grid gap-3', gridClassName || typeConfig.gridClassName)}
    >
      {chunks?.map((item, index) =>
        renderItem
          ? renderItem(item, index)
          : type == 'chip'
            ? renderChip(item, index)
            : renderOptionCard(item, index),
      )}
    </div>
  );
};
