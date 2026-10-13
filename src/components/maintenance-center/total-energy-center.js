'use client';

import Banner from '../common/banner/banner';
import NextImage from '../common/nextImage';
import { appPaths, appSections } from '@/constants';
import { useTranslations } from 'next-intl';
import { isSectionEnabled } from '@/configs';
import { getAsset } from '@/utils/general';
import { useIsMobile } from '@/providers/isMobile';
import ClickEventTracker from '@/services/analyticsService/clickTracker';

const TotalEnergyCenterBanner = ({
  logoPosition = 'right',
  btnText,
  btnIcon,
  btnVariant,
}) => {
  const t = useTranslations('common');
  const isMob = useIsMobile() ?? false;

  if (!isSectionEnabled(appSections.TOTAL_ENERGIES_BANNER)) return null;

  return (
    <ClickEventTracker gaEvent="click_total">
      <Banner
        title={t('Premium Maintenance')}
        className={
          "bg-[url('/assets/total-banner-bg-mob.webp')] md:bg-[url('/assets/total-banner-bg.webp')] bg-cover bg-bottom-left"
        }
        description={t('Proven Performance')}
        titleClassName="text-white text-base md:text-2xl font-extrabold"
        // descriptionIcon={<LocationIcon className="w-4 h-4" />}

        descriptionClassName="text-white text-xs md:text-lg"
        logo={
          <NextImage
            src={getAsset('/assets/totalLogo.png')}
            width={88}
            height={88}
            className="h-[50px] w-[50px] md:h-[88px] md:w-[88px]"
          />
        }
        href={`${appPaths.maintenanceCenter}/totalenergies-alex-km59/4551`}
        logoPosition={logoPosition}
        btnText={btnText}
        btnIcon={btnIcon}
        btnVariant={btnVariant}
        imageSrc={
          isMob
            ? getAsset('/assets/total-banner-bg-mob.webp')
            : getAsset('/assets/total-banner-bg.webp')
        }
      />
    </ClickEventTracker>
  );
};

export default TotalEnergyCenterBanner;
