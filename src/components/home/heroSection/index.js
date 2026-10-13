import HomeLandingSearch from '@/components/landingSearch/homelandingSearch';
import NextImage from '@/components/common/nextImage';
import { getAsset } from '@/utils/general';
import { getTranslations } from 'next-intl/server';
import { isMobileServer } from '@/utils/serverFunctions';
import configs from '@/configs';
import HeroSectionContainer from '@/components/common/heroSection/heroSection';
import UsedCarLandingSearch from '@/components/landingSearch/usedCarLandingSearch';

const HeroSection = async ({ locale }) => {
  const isMobile = await isMobileServer();
  const t = await getTranslations('layout');
  const metaT = await getTranslations('metadata');
  return (
    <HeroSectionContainer
      imageSrc={
        isMobile
          ? getAsset('/assets/landing/home-landing-latest-banner-sm.webp')
          : getAsset('/assets/landing/home-landing-banner-new.webp')
      }
      containerClassName="bg-[linear-gradient(to_top,#1F3C66_0%,#2C5692_100%)]"
    >
      <div className="w-full md:w-1/2  space-y-3 md:space-y-6 md:pt-10">
        <h1 className="text-[32px] lg:text-[44px] lg:rtl:text-[38px] w-full leading-[40px] lg:leading-[70px] font-bold text-white ">
          {metaT('Buy or Sell')}
          {/* {isMobile && (
            <NextImage
              priority
              width={150}
              height={64}
              src={getAsset('/assets/landing/landing-car.webp')}
              className=" inline w-[75px] md:w-[150px] h-auto ms-2 flipX"
            />
          )} */}
          {isMobile && <br />}{' '}
          {metaT('Used & New Cars', {
            country: configs.country[locale].label,
          })}
        </h1>

        <HomeLandingSearch isMobile={isMobile} />
      </div>
    </HeroSectionContainer>
  );
};

export default HeroSection;
