import { IS_PRODUCTION } from './src/constants/index.js';
import { abandonedPagesRedirects } from './src/configs/redirectRulesMap.js';
import bundleAnalyzer from '@next/bundle-analyzer';
import configs from './src/configs/index.js';
import { getRedirectsForTenant } from './src/configs/redirectRulesMap.js';
import { withSentryConfig } from '@sentry/nextjs';
import { getCacheHeadersForTenant } from './src/tenant/common/cache/index.js';

const nextConfig = async () => {
  const { appPaths, otherVehicles } = await import('./src/constants/index.js');
  const { default: createNextIntlPlugin } = await import('next-intl/plugin');
  const { tenant } = await import('./src/configs/index.js');
  const { tenantRedirects } = await import('./src/configs/redirects.js');

  const withNextIntl = createNextIntlPlugin('./src/i18n/request.js');
  return withNextIntl({
    skipProxyUrlNormalize: true,
    async headers() {
      // Generate headers from tenant-based cache configuration
      const cacheHeadersConfig = getCacheHeadersForTenant(tenant);
      const headers = cacheHeadersConfig.map((config) => ({
        source: config.source,
        headers: [
          {
            key: 'Cache-Control',
            value: config.cacheControl,
          },
        ],
      }));

      // Add headers for app association files (deep linking)
      headers.push(
        {
          source: '/.well-known/apple-app-site-association',
          headers: [
            {
              key: 'Content-Type',
              value: 'application/json',
            },
          ],
        },
        {
          source: '/.well-known/assetlinks.json',
          headers: [
            {
              key: 'Content-Type',
              value: 'application/json',
            },
          ],
        },
      );

      return headers;
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'legion-images.hatla2ee-stage.dubizzlelabs.run',
        },
        { protocol: 'https', hostname: 'cdn-news.hatla2ee.com' },
        {
          protocol: 'https',
          hostname: '.s3.eu-west-1.amazonaws.com',
          port: '',
          pathname: '/listing_image/**',
          search: '',
        },
        ...(configs.remotePatterns || []).filter(
          (pattern) => pattern.hostname && pattern.hostname.trim(),
        ),
      ],
    },
    async rewrites() {
      const routes = [];

      // ---------- USED CARS Prices ----------
      // TO (Max)
      routes.push(
        {
          source: `/:locale${appPaths.usedCarPricesTo}/:max`,
          destination: `/:locale${appPaths.usedCarPrices}?max=:max`,
        },
        {
          source: `/:locale${appPaths.usedCarPricesTo}/:max/page/:page`,
          destination: `/:locale${appPaths.usedCarPrices}?max=:max&page=:page`,
        },
      );

      // FROM (Min)
      routes.push(
        {
          source: `/:locale${appPaths.usedCarPricesFrom}/:min`,
          destination: `/:locale${appPaths.usedCarPrices}?min=:min`,
        },
        {
          source: `/:locale${appPaths.usedCarPricesFrom}/:min/page/:page`,
          destination: `/:locale${appPaths.usedCarPrices}?min=:min&page=:page`,
        },
      );

      // RANGE
      routes.push(
        {
          source: `/:locale${appPaths.usedCarPricesRange}/:min/:max`,
          destination: `/:locale${appPaths.usedCarPrices}?min=:min&max=:max`,
        },
        {
          source: `/:locale${appPaths.usedCarPricesRange}/:min/:max/page/:page`,
          destination: `/:locale${appPaths.usedCarPrices}?min=:min&max=:max&page=:page`,
        },
      );

      // Used Car Prices Landing Pagination
      routes.push({
        source: '/:locale/car/used-prices/page/:page',
        destination: '/:locale/car/used-prices?page=:page',
      });

      // ---------- NEW CARS Prices----------
      // TO (Max)
      routes.push(
        {
          source: `/:locale${appPaths.newCarPricesTo}/:max`,
          destination: `/:locale${appPaths['new-car-prices']}?max=:max`,
        },
        {
          source: `/:locale${appPaths.newCarPricesTo}/:max/page/:page`,
          destination: `/:locale${appPaths['new-car-prices']}?max=:max&page=:page`,
        },
      );

      // FROM (Min)
      routes.push(
        {
          source: `/:locale${appPaths.newCarPricesFrom}/:min`,
          destination: `/:locale${appPaths['new-car-prices']}?min=:min`,
        },
        {
          source: `/:locale${appPaths.newCarPricesFrom}/:min/page/:page`,
          destination: `/:locale${appPaths['new-car-prices']}?min=:min&page=:page`,
        },
      );

      // RANGE
      routes.push(
        {
          source: `/:locale${appPaths.newCarPricesRange}/:min/:max`,
          destination: `/:locale${appPaths['new-car-prices']}?min=:min&max=:max`,
        },
        {
          source: `/:locale${appPaths.newCarPricesRange}/:min/:max/page/:page`,
          destination: `/:locale${appPaths['new-car-prices']}?min=:min&max=:max&page=:page`,
        },
      );

      // New Car Prices Landing Pagination
      routes.push({
        source: `/:locale${appPaths['new-car-prices']}/page/:page`,
        destination: `/:locale${appPaths['new-car-prices']}?page=:page`,
      });

      //Car Finance Routes
      routes.push(
        {
          source: '/:locale/car-finance/finance-new-car',
          destination: `/:locale${appPaths['carFinance']}?type=new`,
        },
        {
          source: '/:locale/car-finance/finance-used-car',
          destination: `/:locale${appPaths['carFinance']}?type=used`,
        },
        {
          source: '/:locale/car-finance/new',
          destination: `/:locale${appPaths['carFinance']}?type=new`,
        },
      );

      // New Vehicle Prices
      otherVehicles.forEach((vehicle) => {
        const sourceBase = `/:locale/${vehicle}/all-prices`;
        const destinationBase = `/:locale${appPaths['new-car-prices']}?vehicle=${vehicle}`;

        routes.push(
          {
            source: sourceBase,
            destination: destinationBase,
          },
          {
            source: `${sourceBase}/page/:page`,
            destination: `${destinationBase}&page=:page`,
          },
          {
            source: `/:locale${appPaths[`new-${vehicle}-prices-make`]}/:make`,
            destination: `/:locale${appPaths['new-car-prices-make']}/:make?vehicle=${vehicle}`,
          },
        );
      });

      // Used Car Prices: Make & Model Pagination (only for used-prices)
      routes.push(
        {
          source: `/:locale${appPaths['usedCarPrices']}/:make/page/:page`,
          destination: `/:locale${appPaths['usedCarPrices']}/:make?page=:page`,
        },
        {
          source: `/:locale${appPaths['usedCarPrices']}/:make/:model/page/:page`,
          destination: `/:locale${appPaths['usedCarPrices']}/:make/:model?page=:page`,
        },
        {
          source: `/:locale${appPaths['usedCarPrices']}/:make/:model/:year/page/:page`,
          destination: `/:locale${appPaths['usedCarPrices']}/:make/:model/:year?page=:page`,
        },
      );

      // Car Price Changes
      routes.push(
        {
          source: `/:locale${appPaths.newCarsPriceChanges}`, //This rewrite had been added to prevent new car search bring served on this url specifically /new-car/:make
          destination: `/:locale${appPaths.newCarsPriceChanges}`,
        },
        {
          source: `/:locale${appPaths['newCarsPriceChanges']}/page/:page`,
          destination: `/:locale${appPaths['newCarsPriceChanges']}?page=:page`,
        },
        {
          source: `/:locale${appPaths['newCarsPriceChanges']}/:make`,
          destination: `/:locale${appPaths['newCarsPriceChanges']}?make=:make`,
        },
        {
          source: `/:locale${appPaths['newCarsPriceChanges']}/:make/page/:page`,
          destination: `/:locale${appPaths['newCarsPriceChanges']}?make=:make&page=:page`,
        },
      );

      // Showroom
      routes.push(
        //show room: used
        {
          source: '/:locale/showroom/page/:pageNumber',
          destination: '/:locale/showroom?page=:pageNumber',
        },
        {
          source: '/:locale/showroom/:name/used/page/:pageNumber',
          destination:
            '/:locale/showroom/:name?condition=used&page=:pageNumber',
        },
        {
          source: '/:locale/showroom/:name/page/:pageNumber',
          destination: '/:locale/showroom/:name?page=:pageNumber',
        },
        {
          source: '/:locale/showroom/:name/used',
          destination: '/:locale/showroom/:name?condition=used',
        },
        {
          source: '/:locale/showroom/:name/:make((?!en$|ar$).*)',
          destination: '/:locale/showroom/:name?make=:make',
        },

        //show room: new
        {
          source: '/:locale/showroom-new/page/:pageNumber',
          destination: '/:locale/showroom-new?page=:pageNumber',
        },
        {
          source: '/:locale/showroom-new/:name/page/:pageNumber',
          destination: '/:locale/showroom-new/:name?page=:pageNumber',
        },
        //show room: authorized
        {
          source: '/:locale/showroom-authorized/page/:pageNumber',
          destination: '/:locale/showroom-authorized?page=:pageNumber',
        },
        {
          source: '/:locale/showroom-authorized/:name/page/:pageNumber',
          destination: '/:locale/showroom-authorized/:name?page=:pageNumber',
        },
        //show room: electric
        {
          source: '/:locale/showroom-electric/page/:pageNumber',
          destination: '/:locale/showroom-electric?page=:pageNumber',
        },
      );

      /*
        rewrites for used cars listings page
      */
      routes.push(
        {
          source: '/:locale/imported-car',
          destination: '/:locale/car/imported-car',
        },
        {
          source: '/:locale/imported-car/page/:page',
          destination: '/:locale/car/imported-car?page=:page',
        },
      );
      routes.push(
        {
          source: '/:locale/car/imported',
          destination: '/:locale/car/imported?condition=used',
        },
        {
          source: '/:locale/car/imported/page/:page',
          destination: '/:locale/car/imported?page=:page&condition=used',
        },
      );
      routes.push(
        {
          source: '/:locale/imported-car/:make',
          destination: '/:locale/car/imported-car?make=:make',
        },
        {
          source: '/:locale/imported-car/:make/page/:page',
          destination: '/:locale/car/imported-car?page=:page&make=:make',
        },
        {
          source: '/:locale/new-car/imported',
          destination: '/:locale/car/imported?condition=new',
        },
        {
          source: '/:locale/new-car/imported/page/:page',
          destination: '/:locale/car/imported?page=:page&condition=new',
        },
        {
          source: '/:locale/new-car/imported/:make/:model',
          destination:
            '/:locale/car/imported?make=:make&model=:model&condition=new',
        },
        {
          source: '/:locale/new-car/imported/:make/:model/page/:page',
          destination:
            '/:locale/car/imported?make=:make&model=:model&condition=new&page=:page',
        },
      );
      routes.push(
        {
          source: '/:locale/car/used-car-financed',
          destination: '/:locale/car/used-car-financed?condition=used',
        },
        {
          source: '/:locale/car/used-car-financed/page/:page',
          destination:
            '/:locale/car/used-car-financed?page=:page&condition=used',
        },
      );

      // since this route e.g /car/toyota/page/2 went to detail page
      routes.push({
        source: '/:locale/car/:make/page/:page',
        destination: '/:locale/car/:make?page=:page',
      });

      //maintenance center rewrites
      routes.push({
        source: `/:locale${appPaths.maintenanceCenter}/page/:page`,
        destination: `/:locale${appPaths.maintenanceCenter}?page=:page`,
      });
      routes.push({
        source: `/:locale${appPaths.maintenanceCenter}/city/:slug/page/:page`,
        destination: `/:locale${appPaths.maintenanceCenter}/city/:slug?page=:page`,
      });
      routes.push({
        source: `/:locale${appPaths.maintenanceCenter}/brand/:name/page/:page`,
        destination: `/:locale${appPaths.maintenanceCenter}/brand/:name?page=:page`,
      });
      routes.push({
        source: `/:locale${appPaths.maintenanceCenter}/city/:slug/brand/:name/page/:page`,
        destination: `/:locale${appPaths.maintenanceCenter}/city/:slug/brand/:name?page=:page`,
      });

      // Comparison rewrites - Add this to prevent new car search being served on comparison landing URL because of existing logic
      routes.push({
        source: `/:locale${appPaths.newCarCompare}`,
        destination: `/:locale${appPaths.newCarCompare}`,
      });

      // Comparison landing with pagination
      routes.push({
        source: `/:locale${appPaths.newCarCompare}/page/:page`,
        destination: `/:locale${appPaths.newCarCompare}?page=:page`,
      });

      //comaprison landing and landing with pagination rewrites for other vehicles
      routes.push({
        source: `/:locale${appPaths.newBusCompare}`,
        destination: `/:locale${appPaths.newCarCompare}?vehicle=bus`,
      });
      routes.push({
        source: `/:locale${appPaths.newBusCompare}/:vehicle/page/:page`,
        destination: `/:locale${appPaths.newCarCompare}?vehicle=bus&page=:page`,
      });
      routes.push({
        source: `/:locale${appPaths.newTrucksCompare}`,
        destination: `/:locale${appPaths.newCarCompare}?vehicle=trucks`,
      });
      routes.push({
        source: `/:locale${appPaths.newTrucksCompare}/:vehicle/page/:page`,
        destination: `/:locale${appPaths.newCarCompare}?vehicle=trucks&page=:page`,
      });
      routes.push({
        source: `/:locale${appPaths.newMotorcycleCompare}`,
        destination: `/:locale${appPaths.newCarCompare}?vehicle=motorcycle`,
      });
      routes.push({
        source: `/:locale${appPaths.newMotorcycleCompare}/:vehicle/page/:page`,
        destination: `/:locale${appPaths.newCarCompare}?vehicle=motorcycle&page=:page`,
      });

      // Comparison terazes rewrites for other vehicles
      routes.push({
        source: `/:locale${appPaths['new-bus-compare-terazes']}/:ids*`,
        destination: `/:locale${appPaths['new-car-compare-terazes']}/:ids*?vehicle=bus`,
      });
      routes.push({
        source: `/:locale${appPaths['new-motorcycle-compare-terazes']}/:ids*`,
        destination: `/:locale${appPaths['new-car-compare-terazes']}/:ids*?vehicle=motorcycle`,
      });
      routes.push({
        source: `/:locale${appPaths['new-trucks-compare-terazes']}/:ids*`,
        destination: `/:locale${appPaths['new-car-compare-terazes']}/:ids*?vehicle=trucks`,
      });

      // New Cars Listing rewrites: Add source=search only to actual search URL
      // Search page (actual search - add source=search flag)
      routes.push({
        source: '/:locale/new-car/search',
        destination: '/:locale/new-car/search?source=search',
      });

      routes.push({
        source: '/:locale/new-car/page/:page',
        destination: '/:locale/new-car/search?page=:page',
      });

      // Body type listings with pagination (no source param = pretty URL)
      routes.push({
        source: '/:locale/new-car/body/:body/page/:page',
        destination: '/:locale/new-car/search?body=:body&page=:page',
      });
      routes.push({
        source: '/:locale/new-car/body/:body',
        destination: '/:locale/new-car/search?body=:body',
      });

      // Price range listings with pagination (no source param = pretty URL)
      routes.push({
        source: '/:locale/new-car/price-limit/:price/page/:page',
        destination: '/:locale/new-car/search?priceMax=:price&page=:page',
      });
      routes.push({
        source: '/:locale/new-car/price-limit/:price',
        destination: '/:locale/new-car/search?priceMax=:price',
      });

      routes.push({
        source: '/:locale/new-car/offers/page/:page',
        destination: '/:locale/new-car/offers?page=:page',
      });
      routes.push({
        source: '/:locale/new-car/offers',
        destination: '/:locale/new-car/offers',
      });

      // Make listings with pagination (no source param = pretty URL)
      routes.push({
        source: '/:locale/new-car/:make/page/:page',
        destination: '/:locale/new-car/search?make=:make&page=:page',
      });
      routes.push({
        source: '/:locale/new-car/:make',
        destination: '/:locale/new-car/search?make=:make',
      });

      // New Cars Listing rewrites End Here

      routes.push({
        source: '/:locale/new-trucks/origin/:country',
        destination: '/:locale/new-car/origin/:country?vehicle=trucks',
      });
      routes.push({
        source: '/:locale/new-car/origin/:country',
        destination: '/:locale/new-car/origin/:country?vehicle=car',
      });
      routes.push({
        source: '/:locale/new-bus/origin/:country',
        destination: '/:locale/new-car/origin/:country?vehicle=bus',
      });
      routes.push({
        source: '/:locale/new-motorcycle/origin/:country',
        destination: '/:locale/new-car/origin/:country?vehicle=motorcycle',
      });
      // New Trucks Listing rewrites: Add source=search only to actual search URL
      // Search page (actual search - add source=search flag)
      routes.push({
        source: '/:locale/new-trucks/search',
        destination: '/:locale/new-trucks/search?source=search',
      });

      routes.push({
        source: '/:locale/new-trucks/page/:page',
        destination: '/:locale/new-trucks/search?page=:page',
      });

      // Body type listings with pagination (no source param = pretty URL)
      routes.push({
        source: '/:locale/new-trucks/body/:body/page/:page',
        destination: '/:locale/new-trucks/search?body=:body&page=:page',
      });
      routes.push({
        source: '/:locale/new-trucks/body/:body',
        destination: '/:locale/new-trucks/search?body=:body',
      });

      // Price range listings with pagination (no source param = pretty URL)
      routes.push({
        source: '/:locale/new-trucks/price-limit/:price/page/:page',
        destination: '/:locale/new-trucks/search?priceMax=:price&page=:page',
      });
      routes.push({
        source: '/:locale/new-trucks/price-limit/:price',
        destination: '/:locale/new-trucks/search?priceMax=:price',
      });

      // Make listings with pagination (no source param = pretty URL)
      routes.push({
        source: '/:locale/new-trucks/:make/page/:page',
        destination: '/:locale/new-trucks/search?make=:make&page=:page',
      });
      routes.push({
        source: '/:locale/new-trucks/:make',
        destination: '/:locale/new-trucks/search?make=:make',
      });

      // New Trucks Listing rewrites End Here

      // New Bus Listing rewrites: Add source=search only to actual search URL
      // Search page (actual search - add source=search flag)
      routes.push(
        {
          source: '/:locale/new-bus/search',
          destination: '/:locale/new-bus/search?source=search',
        },
        {
          source: '/:locale/new-bus/page/:page',
          destination: '/:locale/new-bus/search?page=:page',
        },
        {
          source: '/:locale/new-bus/body/:body/page/:page',
          destination: '/:locale/new-bus/search?body=:body&page=:page',
        },
        {
          source: '/:locale/new-bus/body/:body',
          destination: '/:locale/new-bus/search?body=:body',
        },
        {
          source: '/:locale/new-bus/price-limit/:price/page/:page',
          destination: '/:locale/new-bus/search?priceMax=:price&page=:page',
        },
        {
          source: '/:locale/new-bus/price-limit/:price',
          destination: '/:locale/new-bus/search?priceMax=:price',
        },
        {
          source: '/:locale/new-bus/:make/page/:page',
          destination: '/:locale/new-bus/search?make=:make&page=:page',
        },
        {
          source: '/:locale/new-bus/:make',
          destination: '/:locale/new-bus/search?make=:make',
        },
      );

      // New Bus Listing rewrites End Here

      // New motorcycles Listing rewrites: Add source=search only to actual search URL
      // Search page (actual search - add source=search flag)
      routes.push(
        {
          source: '/:locale/new-motorcycle/search',
          destination: '/:locale/new-motorcycle/search?source=search',
        },
        {
          source: '/:locale/new-motorcycle/page/:page',
          destination: '/:locale/new-motorcycle/search?page=:page',
        },
        {
          source: '/:locale/new-motorcycle/body/:body/page/:page',
          destination: '/:locale/new-motorcycle/search?body=:body&page=:page',
        },
        {
          source: '/:locale/new-motorcycle/body/:body',
          destination: '/:locale/new-motorcycle/search?body=:body',
        },
        {
          source: '/:locale/new-motorcycle/price-limit/:price/page/:page',
          destination:
            '/:locale/new-motorcycle/search?priceMax=:price&page=:page',
        },
        {
          source: '/:locale/new-motorcycle/price-limit/:price',
          destination: '/:locale/new-motorcycle/search?priceMax=:price',
        },
        {
          source: '/:locale/new-motorcycle/:make/page/:page',
          destination: '/:locale/new-motorcycle/search?make=:make&page=:page',
        },
        {
          source: '/:locale/new-motorcycle/:make',
          destination: '/:locale/new-motorcycle/search?make=:make',
        },
        {
          source: '/:locale/review/page/:page',
          destination: '/:locale/review?page=:page',
        },
        {
          source: '/:locale/review/:make/page/:page',
          destination: '/:locale/review/:make?page=:page',
        },
      );

      // New motorcycles Listing rewrites End Here

      return routes;
    },

    async redirects() {
      const routes = [];

      routes.push(...tenantRedirects[tenant]);

      routes.push({
        source: '/:locale/car/used-car-pre-existing-installement',
        destination: '/:locale/car/used-car-financed',
        permanent: false,
      });

      routes.push({
        source: '/showroom/:showroomName/:locale(en|ar)/:brand/:model',
        destination: '/showroom/:showroomName/:locale/:brand',
        permanent: true,
      });

      routes.push({
        source: '/:locale/showroom-imported',
        destination: '/:locale/showroom',
        permanent: false,
      });

      routes.push({
        source: '/:locale/showroom-info',
        destination: '/:locale/showroom',
        permanent: false,
      });

      routes.push({
        source: '/:locale/new-car/compare/terazes',
        destination: '/:locale',
        permanent: false,
      });

      routes.push({
        source: '/:locale/car/body/4x4',
        destination: '/:locale/car/search',
        permanent: true,
      });

      routes.push({
        source: '/:locale/car/body/4x4/page/:page',
        destination: '/:locale/car/search',
        permanent: true,
      });

      routes.push({
        source: '/:locale/car/city/:city/body/4x4',
        destination: '/:locale/car/search',
        permanent: true,
      });

      routes.push({
        source: '/:locale/car/city/:city/body/4x4/page/:page',
        destination: '/:locale/car/search',
        permanent: true,
      });

      routes.push({
        source: '/:locale/new-car/body/4x4',
        destination: '/:locale/new-car/search',
        permanent: true,
      });

      routes.push({
        source: '/:locale/new-car/body/4x4/page/:page',
        destination: '/:locale/new-car/search',
        permanent: true,
      });

      routes.push(...getRedirectsForTenant(tenant));

      routes.push(...abandonedPagesRedirects);

      return routes;
    },

    assetPrefix: IS_PRODUCTION ? process.env.NEXT_PUBLIC_CDN_URL : undefined,
  });
};

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const config = IS_PRODUCTION
  ? withSentryConfig(withBundleAnalyzer(nextConfig), {
      org: 'dubizzlelab',
      project: 'hatla2ee-nextjs',
      // Only print logs for uploading source maps in CI
      silent: !process.env.CI,
      // Upload a larger set of source maps for prettier stack traces (increases build time)
      widenClientFileUpload: true,

      // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
      // This can increase your server load as well as your hosting bill.
      // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
      // side errors will fail.
      // tunnelRoute: '/monitoring',
      disableLogger: true,
    })
  : withBundleAnalyzer(nextConfig);

export default config;
