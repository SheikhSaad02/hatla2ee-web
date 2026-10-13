import { fetchNewListingOriginMakes } from '@/apis/new-cars-listings';

import PageLayout from '@/components/layout/pageLayout';
import OriginCountryPage from '@/components/listing/newVehicleListings/originCountry';
import { vehicleSlugLabel } from '@/constants';
import { OriginCountrySEOStrategy } from '@/services/seoStrategy/originCountryPage';
import { getLocaleString } from '@/utils/general';
import { ifError } from '@/utils/ifError';
import { getTranslations } from 'next-intl/server';
import { cache } from 'react';
import { isMobileServer } from '@/utils/serverFunctions';
import { Breadcrumbs } from '@/components/common/breadcrumbs';
import { PageTitle } from '@/components/common/pageTitle/pageTitle';
import { capitalizeFirstLetter } from '@/utils/general';
import { validateAndRedirect } from '@/utils/countryValidation';
import { decodeSearchParams } from '@/utils/url';
const getNewVehicleOriginMakesCached = cache(
  async (country, vehicleParam, vehicle) => {
    return await fetchNewListingOriginMakes(country, vehicleParam, vehicle);
  },
);
export async function generateMetadata({ params, searchParams }) {
  const { locale, country } = await params;
  const { vehicle } = decodeSearchParams(await searchParams);
  const vehicleParam = `new-${vehicle}`;

  const t = await getTranslations({ locale, namespace: 'countries' });
  const originMakes = await getNewVehicleOriginMakesCached(
    country,
    vehicleParam,
    vehicle,
  );

  const carSEO = new OriginCountrySEOStrategy({
    language: locale,
    country:
      getLocaleString(originMakes?.[0]?.origin, 'title', locale) || t(country),
    vehicleType: vehicleSlugLabel[vehicle],
    category: vehicleSlugLabel[vehicle],
  });

  const seoData = await carSEO.generateSEO();

  return {
    title: seoData.metaTitle,
    description: seoData.metaDescription,
  };
}

const OriginCountry = async (props) => {
  const { params, searchParams } = props;
  const { country, locale } = await params;
  const { vehicle } = decodeSearchParams(await searchParams);
  const vehicleParam = `new-${vehicle}`;

  // Validate country and redirect if invalid
  validateAndRedirect(country, locale, vehicle);

  const t = await getTranslations({ locale, namespace: 'countries' });

  const originMakes = await getNewVehicleOriginMakesCached(
    country,
    vehicleParam,
    vehicle,
  );

  ifError(originMakes);
  const isMobile = await isMobileServer();

  const carSEO = new OriginCountrySEOStrategy({
    language: locale,
    country:
      getLocaleString(originMakes?.[0]?.origin, 'title', locale) ||
      t(capitalizeFirstLetter(country)),
    vehicleType: vehicleSlugLabel[vehicle],
    category: vehicleSlugLabel[vehicle],
  });

  const seoData = await carSEO.generateSEO();
  return (
    <PageLayout
      route="origin"
      breadCrumbsList={seoData?.breadcrumbs}
      pageTitle={seoData?.h1}
    >
      <OriginCountryPage
        locale={locale}
        vehicleType={vehicle}
        vehicleParam={vehicleParam}
        originMakes={originMakes}
      />
    </PageLayout>
  );
};

export default OriginCountry;
