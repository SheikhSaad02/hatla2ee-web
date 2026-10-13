import { cache } from 'react';
import { getTranslations } from 'next-intl/server';
import PageLayout from '@/components/layout/pageLayout';
import Container from '@/components/layout/container';
import { getBuyCreditsSeo } from '@/services/seoStrategy/buyCreditsPage';
import { isWebViewServer } from '@/utils/serverFunctions';
import { fetchDealersData } from '@/apis/dealers';
import { mapAgenciesToShowrooms } from '@/mappers/showroom';
import { apiCacheConfig } from '@/configs/cacheConfig';
import StickyTabBar from '@/components/buyCredits/stickyTabBar';
import HeroSection from '@/components/buyCredits/heroSection';
import StatsStrip from '@/components/buyCredits/statsStrip';
import CreditsSection from '@/components/buyCredits/creditsSection';
import ProductsSection from '@/components/buyCredits/productsSection';
import PackagesSection from '@/components/buyCredits/packagesSection';
import ContactSupportBanner from '@/components/buyCredits/contactSupportBanner';
import TestimonialsSection from '@/components/buyCredits/testimonialsSection';
import ShowroomsSection from '@/components/buyCredits/showroomsSection';
import FaqSection from '@/components/buyCredits/faqSection';
import PageDarkBand from '@/components/buyCredits/pageDarkBand';
import PageScrollTracker from '@/components/buyCredits/pageScrollTracker';

const getBuyCreditsSeoCached = cache(async (locale) => {
  return getBuyCreditsSeo(locale);
});

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const seoData = await getBuyCreditsSeoCached(locale);

  return {
    title: { absolute: seoData.metaTitle },
    description: seoData.metaDescription,
    alternates: {
      canonical: seoData.canonical,
      languages: seoData.languages,
    },
    openGraph: seoData.openGraph,
    twitter: seoData.twitterCard,
    robots: seoData.robotsTag,
  };
}

export default async function BuyCreditsPage({ params }) {
  const { locale } = await params;
  const seoData = await getBuyCreditsSeoCached(locale);
  const t = await getTranslations('buyCredits');
  const isWebView = await isWebViewServer();

  const [topDealers, quotedDealers] = await Promise.all([
    fetchDealersData(null, 'sort[listing_count]=desc', {
      next: apiCacheConfig.agencies,
    }),
    fetchDealersData(null, 'f[has_testimonial]=true', {
      next: apiCacheConfig.agencies,
    }),
  ]);

  const showrooms = mapAgenciesToShowrooms(topDealers?.agencies, locale);
  const testimonials = mapAgenciesToShowrooms(
    quotedDealers?.agencies,
    locale,
  ).filter((item) => item.quote);

  const trustedSellersTarget = testimonials.length
    ? 'testimonials'
    : showrooms.length
      ? 'showrooms'
      : null;

  const tabs = [
    { target: 'credits', label: t('tabs.credits') },
    { target: 'products', label: t('tabs.products') },
    { target: 'packages', label: t('tabs.packages') },
    ...(trustedSellersTarget
      ? [{ target: trustedSellersTarget, label: t('tabs.trustedSellers') }]
      : []),
    { target: 'faq', label: t('tabs.faq') },
  ];

  return (
    <PageLayout route="buy-credits" className="gap-0 lg:gap-0 lg:pt-0">
      {seoData?.jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(seoData.jsonLd) }}
        />
      )}
      <PageDarkBand />
      <PageScrollTracker />
      <StickyTabBar
        tabs={tabs}
        ariaLabel={t('tabs.ariaLabel')}
        isWebView={isWebView}
      />
      <HeroSection />
      <div className="py-6 lg:py-8">
        <StatsStrip />
      </div>
      <CreditsSection />
      <ProductsSection />
      <PackagesSection />
      <div className="breakout relative -mt-12 rounded-t-[44px] bg-white pt-12">
        <Container>
          <ContactSupportBanner />
          <TestimonialsSection items={testimonials} />
          <ShowroomsSection showrooms={showrooms} />
          <FaqSection />
        </Container>
      </div>
    </PageLayout>
  );
}
