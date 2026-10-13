import { getTranslations } from 'next-intl/server';
import { fetchCreditPackages } from '@/apis/packages';
import PackagesDarkBand from './packagesDarkBand';
import PackagesHeading from './packagesHeading';

// Heading and package data resolve server-side; the scroll-linked light↔dark
// cross-fade lives in PackagesDarkBand, which still renders light on the
// server.
export default async function PackagesSection() {
  const t = await getTranslations('buyCredits');
  const packages = await fetchCreditPackages();
  if (!packages.length) return null;

  return (
    <section id="packages" className="relative scroll-mt-28">
      <div className="relative pb-24 pt-16 lg:pb-32 lg:pt-20">
        <PackagesHeading>{t('packages.heading')}</PackagesHeading>
        <PackagesDarkBand packages={packages} />
      </div>
    </section>
  );
}
