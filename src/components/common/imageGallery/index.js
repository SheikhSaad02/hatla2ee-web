'use client';
import { tagList } from '@/data/common';
import { cn } from '@/utils';
import { Grip } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { Badge } from '../badge/badge';
import FullScreen from '../fullScreen';
import NextImage from '../nextImage';
import Text from '../text';
import TextWithIcon from '../textWithIcon/textWithIcon';
import CarouselWithThumbnails from './carouselWithThumbnails';
import { useUser } from '@/providers/user';
import { detailPageEvents } from '@/services/analyticsService/events';
import { usePageType } from '@/hooks/usePageType';
const ShowAllPhotosOverlay = ({ totalImages, onClick, t }) => (
  <div
    className="absolute bottom-1.5 end-1.5 px-2.5 py-2 flex items-center rounded-sm bg-[#6D6D6D66] backdrop-blur-sm"
    onClick={(e) => {
      e.stopPropagation();
      onClick(0);
    }}
  >
    <TextWithIcon
      icon={<Grip className="w-4 h-4" />}
      title={t('show_all_photos', { count: totalImages })}
      iconPosition="left"
      className="text-white text-xs gap-1"
      titleClassName="text-xs text-shadow-[0_0_2px_rgb(0_0_0_/_0.25)]"
    />
  </div>
);

const ImageTile = ({
  image,
  onClick,
  index,
  className,
  priority = false,
  showOverlay = false,
  totalImages,
  t,
  badges,
}) => (
  <div
    className={cn(
      'relative cursor-pointer bg-black rounded-lg overflow-hidden',
      className,
    )}
    onClick={() => onClick(index)}
  >
    {badges}
    <NextImage
      src={image?.large}
      priority={priority}
      fetchPriority={priority ? 'high' : undefined}
      fill
      className="object-contain"
      alt={image?.alt}
    />
    {showOverlay && (
      <ShowAllPhotosOverlay totalImages={totalImages} onClick={onClick} t={t} />
    )}
  </div>
);

export function ImageGrid({
  images,
  onClick,
  tags,
  isMob,
  options,
  index,
  sold_at,
  statusLabel,
}) {
  const locale = useLocale();
  const t = useTranslations('common');
  if (!images?.length) return null;

  const direction = locale === 'ar' ? 'rtl' : 'ltr';
  const totalImages = images.length;
  const [mainImage, ...otherImages] = images.slice(0, 7);
  const showFiveImages = totalImages >= 5;
  const showFourImages = totalImages === 4;

  const renderBadges = (
    <div
      className={cn(
        'absolute start-4 flex flex-wrap gap-2 z-10 text-2xs md:text-sm font-bold',
        isMob ? 'bottom-2' : 'top-4',
      )}
      dir={direction}
    >
      {statusLabel && (
        <Badge
          // Matches the spec chips (year / km / fuel) under the title.
          className="transition-transform rounded-sm duration-200 ease-in-out border border-gray-100 bg-gray-50 text-gray-600 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
          variant="outline"
        >
          {statusLabel}
        </Badge>
      )}
      {tagList
        .filter(({ slug }) => tags?.includes(slug))
        .map((tag) => (
          <Badge
            key={tag?.slug}
            className="transition-transform rounded-sm duration-200 ease-in-out"
            variant={tag?.variant}
            href={tag?.href}
            asChild={!!tag?.href}
            linkTooltip={t(tag?.title)}
          >
            {tag?.icon && <span>{tag.icon}</span>}
            {t(tag?.title)}
          </Badge>
        ))}
    </div>
  );

  const gridClassName = cn(sold_at && 'pointer-events-none opacity-60');

  const renderFourImageLayout = () => (
    <div className={cn('grid grid-cols-2 gap-2 mt-2', gridClassName)}>
      {mainImage && (
        <ImageTile
          image={mainImage}
          onClick={onClick}
          index={0}
          className="h-[416px]"
          priority
          badges={renderBadges}
        />
      )}
      <div className="grid grid-rows-2 gap-2">
        {otherImages[0] && (
          <ImageTile image={otherImages[0]} onClick={onClick} index={1} />
        )}
        <div className="grid grid-cols-2 gap-2">
          {otherImages.slice(1, 3).map((image, idx) => (
            <ImageTile
              key={idx}
              image={image}
              onClick={onClick}
              index={idx + 2}
              showOverlay={idx === 1 && totalImages > 4}
              totalImages={totalImages}
              t={t}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderDefaultLayout = () => {
    const gridCols =
      totalImages === 1
        ? 'grid-cols-1'
        : showFiveImages
          ? 'grid-cols-4 gap-2'
          : 'grid-cols-3 gap-3';

    const mainImageClass = cn(
      'col-span-2',
      totalImages === 1 && 'h-[400px]',
      totalImages !== 2 && 'row-span-2',
    );

    const otherImageClass = totalImages === 2 ? 'h-[400px]' : 'h-[200px]';
    const visibleCount = showFiveImages ? 4 : 2;
    const overlayIndex = showFiveImages ? 3 : 1;
    const overlayThreshold = showFiveImages ? 5 : 3;

    return (
      <div className={cn('grid mt-2', gridCols, gridClassName)}>
        {mainImage && (
          <ImageTile
            image={mainImage}
            onClick={onClick}
            index={0}
            className={mainImageClass}
            priority
            badges={renderBadges}
          />
        )}
        {otherImages.slice(0, visibleCount).map((image, idx) => (
          <ImageTile
            key={idx}
            image={image}
            onClick={onClick}
            index={idx + 1}
            className={otherImageClass}
            showOverlay={idx === overlayIndex && totalImages > overlayThreshold}
            totalImages={totalImages}
            t={t}
          />
        ))}
      </div>
    );
  };

  if (isMob) {
    return (
      <div className="breakout">
        <CarouselWithThumbnails
          images={images}
          options={{ ...options, startIndex: index }}
          onSlideClick={onClick}
          mainImgWrapClassName={cn(
            'rounded-none',
            sold_at && 'pointer-events-none opacity-60',
          )}
          imageThumbClass="px-4"
          imageTags={renderBadges}
          mainImgClassName="object-contain w-full aspect-[16/9]"
        />
      </div>
    );
  }

  return showFourImages ? renderFourImageLayout() : renderDefaultLayout();
}

const ImageGallery = (props) => {
  const {
    images,
    options,
    tags,
    isMob,
    modalHeader,
    modalFooter,
    imageThumbClass,
    sold_at,
    statusLabel,
    listingData,
  } = props;
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const t = useTranslations('common');
  const locale = useLocale();
  const { user } = useUser();
  const detectedPageType = usePageType();
  const slideClickHandler = (index) => {
    detailPageEvents.click_gallery(locale, user, listingData, detectedPageType);
    setIndex(index);
    setGalleryOpen(true);
  };

  return (
    <>
      <ImageGrid
        images={images}
        onClick={slideClickHandler}
        tags={tags}
        isMob={isMob}
        options={options}
        index={index}
        sold_at={sold_at}
        statusLabel={statusLabel}
      />
      <FullScreen
        isOpen={galleryOpen}
        headerClassName="shadow-none border-none justify-end"
        overlayClassName={'block bg-black/90'}
        containerClassName={
          '!max-w-[1232] w-full !bg-transparent border-none !rounded-none text-white overflow-y-auto !shadow-none justify-center overflow-visible gap-4 mx-auto pb-[calc(1rem+env(safe-area-inset-bottom))]'
        }
        title={<Text className="sr-only">{t('Image Gallery')}</Text>}
        onClose={() => {
          detailPageEvents.dismiss_gallery(locale, user, listingData, detectedPageType);
          setGalleryOpen(false);
        }}
        closeBtnClassName="!opacity-80 hover:opacity-100! bg-white/20! rounded-full! border-none! text-white top-6 xl:top-4 right-6 xl:right-4 rtl:left-6 rtl:xl:left-4 rtl:right-auto rtl:xl:right-auto"
        showHeader={false}
        outsideCloseBtn
      >
        {modalHeader && modalHeader}
        <CarouselWithThumbnails
          images={images}
          options={{ ...options, startIndex: index }}
          onSlideClick={slideClickHandler}
          imageThumbClass={cn(
            'flex flex-row justify-center items-center',
            imageThumbClass,
          )}
        />
        {modalFooter && modalFooter}
      </FullScreen>
    </>
  );
};

export default ImageGallery;
