import { getTranslations } from 'next-intl/server';

import CarEvaluationBanner from '@/components/car-evaluation/car-evaluation-banner';
import DealersWithClassification from '@/components/home/dealers-section';

import { DealersSectionSkeleton } from '@/components/common/loading';
import { MoreSectionsCarousel } from '@/components/common/moreSectionsCarousel/more-sections-carousel';
import SellCarBanner from '@/components/common/sellCarBanner.js';
import PageLayout from '@/components/layout/pageLayout';
import { isMobileServer } from '@/utils/serverFunctions';
import { ConditionalSuspense as Suspense } from '@/components/common/ConditionalSuspense';
import { PAGE_TYPES } from '@/services/analyticsService/constants';
import { appSections } from '@/constants';
import { isSectionEnabled } from '@/configs';
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return {
    title: t('carEvaluationTitle'),
    description: t('carEvaluationDescription'),
  };
}

export default async function CarEvaluation() {
  const isMobile = await isMobileServer();

  return (
    <PageLayout route="default">
      <CarEvaluationBanner />
      <MoreSectionsCarousel />
      <SellCarBanner isMobileServer={isMobile} />
      {isSectionEnabled(appSections.SHOWROOMS) && (
        <Suspense fallback={<DealersSectionSkeleton isMobile={isMobile} />}>
          <DealersWithClassification
            isMobile={isMobile}
            pageType={PAGE_TYPES?.CAR_EVALUATION}
          />
        </Suspense>
      )}
    </PageLayout>
  );
}
