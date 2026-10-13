import { getLocale, getTranslations } from 'next-intl/server';
import FeatureCard from '../common/featureCard';
import CarouselSection from '../common/carouselSection/carouselSection';
import { getAsset } from '@/utils/general';
import { isMobileServer } from '@/utils/serverFunctions';
import { EV_LOW_MAINTENANCE_CARDS } from './data';

export default async function LowMaintenanceSection() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'evLanding' });
  const isMobile = await isMobileServer();

  const cards = EV_LOW_MAINTENANCE_CARDS.map((card) => ({
    title: t(card.titleKey),
    description: t(card.descriptionKey),
    image: getAsset(card.image),
  }));

  return (
    <section className="flex flex-col gap-3 md:gap-6">
      <h2 className="sectionHeading">{t('lowMaintenanceTitle')}</h2>

      {isMobile ? (
        <CarouselSection itemBasis="basis-[256px]" showDots>
          {cards.map((card, i) => (
            <FeatureCard key={i} {...card} />
          ))}
        </CarouselSection>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {cards.map((card, i) => (
            <FeatureCard key={i} {...card} />
          ))}
        </div>
      )}
    </section>
  );
}
