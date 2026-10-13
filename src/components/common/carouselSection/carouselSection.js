import Carousel from '../carousel/carousel';

export default function CarouselSection({
  opts,
  children,
  className,
  itemClassName,
  itemBasis,
  isMobile,
  pageType,
  pageSection,
  ...rest
}) {
  return (
    <Carousel
      isMobileServer={isMobile}
      carouselOpts={{
        align: 'start', loop: false, slidesToScroll: 'auto',
        dragFree: false, ...opts
      }}
      itemClassName={itemClassName}
      itemBasis={itemBasis}
      pageType={pageType}
      pageSection={pageSection}
      {...rest}
    >
      {children}
    </Carousel>
  );
}
