import { isMobileServer } from '@/utils/serverFunctions';
import CarEvaluationForm from './car-evaluation-form';

import HeroSectionContainer from '../common/heroSection/heroSection';
import { getAsset } from '@/utils/general';

export default async function CarEvaluationBanner() {
  const isMobile = await isMobileServer();
  return (
    <HeroSectionContainer
      imageSrc={
        isMobile
          ? getAsset('/assets/landing/car-evaluation-landing-banner-sm.webp')
          : getAsset('/assets/landing/car-evaluation-landing-banner.webp')
      }
      imageClassName="object-[center_8%]"
      containerClassName=" bg-top md:bg-center"
    >
      <div className="w-full md:w-1/2 md:pt-10">
        <CarEvaluationForm isMobile={isMobile} />
      </div>
    </HeroSectionContainer>
  );
}
