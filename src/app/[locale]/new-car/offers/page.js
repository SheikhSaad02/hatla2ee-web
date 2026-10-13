import NewVehicleListings from '@/components/listing/newVehicleListings/newVehicleListings';
import PageLayout from '@/components/layout/pageLayout';
import { getTranslations } from 'next-intl/server';
import { appPaths, newVehiclesCategorySlugs } from '@/constants';
import { notFound } from 'next/navigation';
import { decodeSearchParams } from '@/utils/url';

export async function generateMetadata({ params, searchParams }) {
  const { locale } = await params;
  const { page } = decodeSearchParams(await searchParams);
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: {
      absolute: `${t('New Car Offers')} : ${t('Hatla2ee')}${
        page && page > 1 ? ` - ${t('Page')} ${page}` : ''
      }`,
    },
    description: '',
  };
}

const page = async ({ params }) => {
  notFound();
  //For the time being we are not catering this page.
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const layoutT = await getTranslations({ locale, namespace: 'layout' });
  return (
    <PageLayout route="new-listings">
      <NewVehicleListings
        isSearch={false}
        searchParams={{}}
        showQuickFiltersWidget
        additionalQuery={{
          discount: 'notnull',
        }}
        seoData={{
          heading: t('New Car Offers'),
          breadcrumbs: [
            { href: appPaths['new-car'], label: layoutT('New Car') },
          ],
        }}
        categorySlug={newVehiclesCategorySlugs.newCars}
      />
    </PageLayout>
  );
};

export default page;
