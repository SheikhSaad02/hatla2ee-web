import { getLocale, getTranslations } from 'next-intl/server';
import SpecCard from '../common/specCard';
import { getAsset } from '@/utils/general';
import { isMobileServer } from '@/utils/serverFunctions';
import { EV_TYPE_CARDS } from './data';

export default async function ChooseRightEvSection() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'evLanding' });
  const isMobile = await isMobileServer();

  return (
    <section className="flex flex-col gap-3 md:gap-4">
      <h2 className="sectionHeading">{t('chooseRightEvTitle')}</h2>

      <div className="flex flex-col gap-3 md:gap-4">
        {EV_TYPE_CARDS.map(({ type, title, description, fuel, imageBase }) => {
          const Type = type.charAt(0).toUpperCase() + type.slice(1);
          return (
            <SpecCard
              key={type}
              tag={t(`${type}Tag`)}
              title={t(title)}
              description={t(description)}
              specs={[
                { label: t('powerSource'), value: t(`${type}Power`) },
                { label: t('singleChargeRange'), value: t(`${type}Range`) },
              ]}
              buttonLabel={t(`viewAll${Type}`)}
              buttonHref={`/new-car/search?fuel=${fuel}`}
              image={getAsset(`/assets/ev-images/${imageBase}-car-${locale}.webp`)}
              seeMoreLabel={t('seeMore')}
              isMobile={isMobile}
              viewAllType={type}
            />
          );
        })}
      </div>
    </section>
  );
}
