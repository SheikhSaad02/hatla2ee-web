import { isMobileServer } from '@/utils/serverFunctions';
import NewCarLandingSearch from '../landingSearch/newCarLandingSearch';
import HeroSectionContainer from '../common/heroSection/heroSection';
//this component will cater banner images according to category slug
import { newVehiclesCategorySlugs } from '@/constants';
import { getAsset } from '@/utils/general';

const NewCarHeroSection = async ({
  title,
  containerClassName,
  categorySlug = newVehiclesCategorySlugs.newCars,
}) => {
  const isMobile = await isMobileServer();

  const imageSrc = (() => {
    switch (categorySlug) {
      case newVehiclesCategorySlugs.newCars:
        return !isMobile
          ? '/assets/landing/new-car-landing-banner.webp'
          : '/assets/landing/new-car-landing-banner-sm.webp';

      case newVehiclesCategorySlugs.newBus:
        return !isMobile
          ? '/assets/landing/new-buses-banner.webp'
          : '/assets/landing/new-buses-banner-sm.webp';

      case newVehiclesCategorySlugs.newTrucks:
        return !isMobile
          ? '/assets/landing/new-truck-banner.webp'
          : '/assets/landing/new-truck-banner-sm.webp';

      case newVehiclesCategorySlugs.newMotorcycle:
        return !isMobile
          ? '/assets/landing/new-motorcycle-banner.webp'
          : '/assets/landing/new-motorcycle-banner-sm.webp';

      default:
        break;
    }
  })();
  return (
    <HeroSectionContainer
      imageSrc={getAsset(imageSrc)}
      containerClassName={containerClassName}
    >
      <div className="w-full md:w-1/2  space-y-3 md:space-y-6 md:pt-10">
        <h1 className="heroHeading">{title}</h1>

        <NewCarLandingSearch isMobile={isMobile} categorySlug={categorySlug} />
      </div>
    </HeroSectionContainer>
  );
};

export default NewCarHeroSection;
