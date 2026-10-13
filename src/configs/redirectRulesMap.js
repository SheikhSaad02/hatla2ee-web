// Tenant-based redirects configuration for Next.js
// Migrated from .htaccess with tenant classification
// Total redirects: 247 (classified by tenant)

import { BASE_URL } from '../constants/index.js';
import { getAllCityRedirects } from './cityRedirects.js';

// Egypt-specific redirects (all /new-car/ to /car/ migrations)
const egRedirects = [
  // 2024-10
  {
    source: '/:locale(en|ar)/new-car/fiat/500C/:variantId?',
    destination: '/:locale/car/fiat/500C',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/byd/l3/:variantId?',
    destination: '/:locale/car/byd/l3',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/skoda/Kamiq/:variantId?',
    destination: '/:locale/car/skoda/Kamiq',
    statusCode: 301,
  },
  // {
  //   source: '/:locale(en|ar)/new-car/suzuki/Jimny/:path*',
  //   destination: '/:locale/car/suzuki/Jimny',
  //   statusCode: 301,
  // },
  {
    source: '/:locale(en|ar)/new-car/suzuki/vitara/:variantId?',
    destination: '/:locale/car/suzuki/vitara',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/bestune/T33/:variantId?',
    destination: '/:locale/car/bestune/T33',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/lada/granta/:variantId?',
    destination: '/:locale/car/lada/granta',
    statusCode: 301,
  },
  // 2024-03
  {
    source: '/:locale(en|ar)/new-car/hyundai/i20/:variantId?',
    destination: '/:locale/car/hyundai/i20',
    statusCode: 301,
  },
  // {
  //   source: '/:locale(en|ar)/new-car/toyota/land-cruiser/:path*',
  //   destination: '/:locale/car/toyota/land-cruiser',
  //   statusCode: 301,
  // },
  {
    source: '/:locale(en|ar)/new-car/hyundai/creta-su2/:variantId?',
    destination: '/:locale/car/hyundai/creta-su2',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/skoda/Skoda-Scala/:variantId?',
    destination: '/:locale/car/skoda/Skoda-Scala',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/jeep/wrangler/:variantId?',
    destination: '/:locale/car/jeep/wrangler',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/hyundai/i10/:variantId?',
    destination: '/:locale/car/hyundai/i10',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/subaru/impreza/:variantId?',
    destination: '/:locale/car/subaru/impreza',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/subaru/xv/:variantId?',
    destination: '/:locale/new-car/subaru/XV-Crosstrek',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/honda/civic/:variantId?',
    destination: '/:locale/car/honda/civic',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/alpha-romeo/giulietta/:variantId?',
    destination: '/:locale/car/alpha-romeo/giulietta',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/renault/Kadjar/:variantId?',
    destination: '/:locale/car/renault/Kadjar',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/chevrolet/malibu/:variantId?',
    destination: '/:locale/car/chevrolet/malibu',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/changhe/M50/:variantId?',
    destination: '/:locale/car/changhe/M50',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/changhe/Q35/:variantId?',
    destination: '/:locale/car/changhe/Q35',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/brilliance/brilliance-V6/:variantId?',
    destination: '/:locale/car/brilliance/brilliance-V6',
    statusCode: 301,
  },
  // 2022-12-08
  {
    source: '/:locale(en|ar)/new-car/opel/astra/:variantId?',
    destination: '/:locale/car/opel/astra',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/ford/fusion/:variantId?',
    destination: '/:locale/car/ford/fusion',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/changan/cs-35/:variantId?',
    destination: '/:locale/car/changan/cs-35',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/mercedes/a-180/:variantId?',
    destination: '/:locale/car/mercedes/a-180',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/mercedes/b-180/:variantId?',
    destination: '/:locale/car/mercedes/b-180',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/mercedes/cla-180/:variantId?',
    destination: '/:locale/car/mercedes/cla-180',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/bmw/418/:variantId?',
    destination: '/:locale/car/bmw/418',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/bmw/740/:variantId?',
    destination: '/:locale/car/bmw/740',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/mini/convertible/:variantId?',
    destination: '/:locale/car/mini/convertible',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/mini/Countryman-S/:variantId?',
    destination: '/:locale/car/mini/Countryman-S',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/mercedes/:model(C\\+300)/:variantId?',
    destination: '/:locale/car/mercedes/:model',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/chevrolet/lanos2/:variantId?',
    destination: '/:locale/car/chevrolet/lanos2',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/chevrolet/cruze/:variantId?',
    destination: '/:locale/car/chevrolet/cruze',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/mercedes/s-320/:variantId?',
    destination: '/:locale/car/mercedes/s-320',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/mercedes/S-450/:variantId?',
    destination: '/:locale/car/mercedes/S-450',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/bmw/218/:variantId?',
    destination: '/:locale/car/bmw/218',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/geely/emgrand-x7/:variantId?',
    destination: '/:locale/car/geely/emgrand-x7',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/jaguar/E-pace/:variantId?',
    destination: '/:locale/car/jaguar/E-pace',
    statusCode: 301,
  },
  // 2022-01-24
  {
    source: '/:locale(en|ar)/new-car/hyundai/creta',
    destination: '/:locale/new-car/hyundai/creta-su2',
    statusCode: 301,
  },
  // {
  //   source: '/:locale(en|ar)/new-car/hyundai/Tucson-GDI/:path*',
  //   destination: '/:locale/new-car/hyundai/tucson-shape-new-generation',
  //   statusCode: 301,
  // },
  {
    source: '/:locale(en|ar)/new-car/hyundai/Tucson-Turbo/:variantId?',
    destination: '/:locale/new-car/hyundai/tucson-shape-new-generation',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/citroen/Grand-C4-Spacetourer/:variantId?',
    destination: '/:locale/new-car/citroen/c4',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/ford/kuga/:variantId?',
    destination: '/:locale/car/ford/kuga',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/byd/BYD-S5/:variantId?',
    destination: '/:locale/car/byd/BYD-S5',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/mitsubishi/lancer/:variantId?',
    destination: '/:locale/car/mitsubishi/lancer',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/mitsubishi/pajero/:variantId?',
    destination: '/:locale/car/mitsubishi/pajero',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/jac/S4/:variantId?',
    destination: '/:locale/car/jac/S4',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/skoda/octavia/:variantId?',
    destination: '/:locale/new-car/skoda/Octavia-A8',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/geely/Imperial/:variantId?',
    destination: '/:locale/car/geely/Imperial',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/geely/emgrand7/:variantId?',
    destination: '/:locale/car/geely/emgrand7',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/renault/captur/:variantId?',
    destination: '/:locale/car/renault/captur',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/seat/LEON\\+CUPRA/:variantId?',
    destination: '/:locale/new-car/seat/leon',
    statusCode: 301,
  },
  // 05/10/2021
  {
    source: '/:locale(en|ar)/car/city/alexandria-city/:path*',
    destination: '/:locale/car/city/alexandria',
    statusCode: 301,
  },
  // 26/09/2021
  {
    source: '/:locale(en|ar)/new-car/kia/Pegas/:variantId?',
    destination: '/:locale/car/kia/Pegas',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/kia/rio/:variantId?',
    destination: '/:locale/car/kia/rio',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/kia/carens/:variantId?',
    destination: '/:locale/car/kia/carens',
    statusCode: 301,
  },
  // {
  //   source: '/:locale(en|ar)/new-car/kia/carnival/:path*',
  //   destination: '/:locale/car/kia/carnival',
  //   statusCode: 301,
  // },
  {
    source: '/:locale(en|ar)/new-car/faw/X40/:variantId?',
    destination: '/:locale/car/faw/X40',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/chevrolet/aveo/:variantId?',
    destination: '/:locale/car/chevrolet/aveo',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/jac/Jac-S7/:variantId?',
    destination: '/:locale/car/jac/Jac-S7',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/faw/:model?/:variantId?',
    destination: '/:locale/car/faw',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/brilliance/v5/:variantId?',
    destination: '/:locale/car/brilliance/v5',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/ford/fiesta/:variantId?',
    destination: '/:locale/car/ford/fiesta',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/chevrolet/equinox/:variantId?',
    destination: '/:locale/car/chevrolet/equinox',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/hyundai/verna/:variantId?',
    destination: '/:locale/car/hyundai/verna',
    statusCode: 301,
  },
  // 2021-09-16
  {
    source: '/:locale(en|ar)/new-car/senova/X35/:variantId?',
    destination: '/:locale/car/senova/X35',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/senova/:model?/:variantId?',
    destination: '/:locale/car/senova',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/chery/chery-envy/:variantId?',
    destination: '/:locale/car/chery/chery-envy',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/new-car/kia/ceed/:variantId?',
    destination: '/:locale/car/kia/ceed',
    statusCode: 301,
  },
  // 2020-12-09
  {
    source: '/:locale(en|ar)/car/changan/ideal',
    destination: '/:locale/car/changhe/changhe-ideal',
    statusCode: 301,
  },

  // Permanent redirects for duplicate city slugs (Egypt-specific)
  // All redirects are generated dynamically from src/configs/cityRedirects.js
  // This covers all 8 city route patterns for each duplicate location
  ...getAllCityRedirects(),
];

// Global redirects (apply to all tenants)
const globalRedirects = [
  // 2023-01
  {
    source: '/ar/car/felicia',
    destination: '/ar/car/skoda/felicia',
    statusCode: 301,
  },
  // Legacy PHP files and WordPress paths
  {
    source: '/(olux|xleet|shell|alfa|about|export|beence|ups|s_e).php',
    destination: '/',
    statusCode: 301,
  },
  {
    source: '/(wp-admin|wp-content|interludemono|wp-inclu|wp_wrong|wp-plugins)',
    destination: '/',
    statusCode: 301,
  },
  // DS BRAND MIGRATION (2019-08-28)
  {
    source: '/:locale(en|ar)/car/citroen/ds3',
    destination: '/:locale/car/ds/ds3',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/car/citroen/ds4',
    destination: '/:locale/car/ds/ds4',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/car/citroen/ds5',
    destination: '/:locale/car/ds/ds5',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/car/citroen/DS7',
    destination: '/:locale/car/ds/DS7',
    statusCode: 301,
  },
  // SHOWROOM REDIRECTS (2018-02-25 & 2014-06-01)
  {
    source: '/nshowroom/heda-motors',
    destination: '/showroom/hada-motors',
    statusCode: 301,
  },
  {
    source: '/osama-motors/en',
    destination: '/showroom/osama-motors',
    statusCode: 301,
  },
  {
    source: '/alex-autotrade/en',
    destination: '/showroom/alex-autotrade',
    statusCode: 301,
  },
  {
    source: '/ma3rd-souq-saiarat/en',
    destination: '/showroom/ma3rd-souq-saiarat',
    statusCode: 301,
  },
  {
    source: '/osama-motors',
    destination: '/showroom/osama-motors',
    statusCode: 301,
  },
  {
    source: '/alex-autotrade',
    destination: '/showroom/alex-autotrade',
    statusCode: 301,
  },
  {
    source: '/ma3rd-souq-saiarat',
    destination: '/showroom/ma3rd-souq-saiarat',
    statusCode: 301,
  },
  // CITY REDIRECTS (2016-09-21 & 2012-2016)
  {
    source: '/:locale(en|ar)/car/city/cairo-city',
    destination: '/:locale/car/city/cairo',
    statusCode: 301,
  },
  // BRAND/MODEL CORRECTIONS (2013-2016)
  {
    source: '/ar/car/mercedes/194',
    destination: '/ar/car/mercedes',
    statusCode: 301,
  },
  {
    source: '/en/car/city/sohagUsed',
    destination: '/en/car/city/sohag',
    statusCode: 301,
  },
  {
    source: '/ar/car/mazda/949',
    destination: '/ar/car/mazda/929',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/car/bmw/330',
    destination: '/:locale/car/bmw/330i',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/car/voyah/Voyah-Free',
    destination: '/:locale/car/voyah/free',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/car/voyah/Voyah\\+Passion',
    destination: '/:locale/car/voyah/passion',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/car/voyah/voyah-dream',
    destination: '/:locale/car/voyah/dream',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/car/m-hero/m-hero-817',
    destination: '/:locale/car/m-hero/817',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/car/m-hero/M-hero-917',
    destination: '/:locale/car/m-hero/917',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/car/m-hero/MHERO\\+1',
    destination: '/:locale/car/m-hero/1',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/car/dfm/E\\+Pai\\+007',
    destination: '/:locale/car/dfm/007',
    statusCode: 301,
  },
  {
    source: '/forum/topic/&',
    destination: '/forum',
    statusCode: 301,
  },
  {
    source: '/en/car/skoda/fantasiaSkoda',
    destination: '/en/car/skoda/fantasia',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/car/porsche/948-syder',
    destination: '/:locale/car/porsche/918-syder',
    statusCode: 301,
  },
  {
    source: '/en/car/all-prices.',
    destination: '/en/car/all-prices',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/car/jeep/a10',
    destination: '/:locale/car/jac/a10',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/car/jeep/scorpio',
    destination: '/:locale/car/mahindra/scorpio',
    statusCode: 301,
  },
  {
    source: '/plugins',
    destination: '/',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/car/outdated',
    destination: '/:locale/car',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/car/body/sport-car',
    destination: '/:locale/car/body/coupe',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/car/gmc/edge',
    destination: '/:locale/car/ford/edge',
    statusCode: 301,
  },
  {
    source: '/ar/car&quot',
    destination: '/ar/car',
    statusCode: 301,
  },
  {
    source: '/en/car/info/mits..',
    destination: '/en/car/info/mitsubishi',
    statusCode: 301,
  },
  {
    source: '/ar/car/hyundai/accent&quot',
    destination: '/ar/car/hyundai/accent',
    statusCode: 301,
  },
  {
    source: '/ar/car/jeep&quot',
    destination: '/ar/car/jeep',
    statusCode: 301,
  },
  {
    source: '/en/car/great',
    destination: '/en/car/info/great-wall',
    statusCode: 301,
  },
  {
    source: '/ar/car/lincoln/g3',
    destination: '/ar/car/lincoln',
    statusCode: 301,
  },
  // TYPO AND TRUNCATION CORRECTIONS (2012)
  {
    source: '/:locale(en|ar)/car/mercedes/terrain',
    destination: '/:locale/car/mercedes',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/car/lada/156',
    destination: '/:locale/car/lada',
    statusCode: 301,
  },
  {
    source: '/ar/sell-your..',
    destination: '/ar/sell-your-car',
    statusCode: 301,
  },
  {
    source: '/en/car/toyota/co',
    destination: '/en/car/toyota',
    statusCode: 301,
  },
  {
    source: '/en/car/kia/cerat',
    destination: '/en/car/kia/cerato',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/car/city/',
    destination: '/:locale/car',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/car///44311',
    destination: '/:locale/car',
    statusCode: 301,
  },
  {
    source: '/en/car/all-price',
    destination: '/en/car/all-prices',
    statusCode: 301,
  },
  {
    source: '/ar/car/brillianc..',
    destination: '/ar/car/brilliance',
    statusCode: 301,
  },
  {
    source: '/ar/car/info/bril..',
    destination: '/ar/car/info/brilliance',
    statusCode: 301,
  },
  {
    source: '/ar/car/chevrolet..',
    destination: '/ar/car/chevrolet',
    statusCode: 301,
  },
  {
    source: '/ar/car/volks-wag..',
    destination: '/ar/car/volks-wagen',
    statusCode: 301,
  },
  {
    source: '/ar/car/fiat/',
    destination: '/ar/car/fiat',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/car/peugeot/saga',
    destination: '/:locale/car/peugeot',
    statusCode: 301,
  },
  {
    source: '/ar/car/info/chev..',
    destination: '/ar/car/info/chevrolet',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/car/bmw/grand-turismo',
    destination: '/:locale/car/bmw',
    statusCode: 301,
  },
  {
    source: '/ar/car/mitsubish..',
    destination: '/ar/car/mitsubishi',
    statusCode: 301,
  },
  {
    source: '/ar/car/city/alex..',
    destination: '/ar/car',
    statusCode: 301,
  },
  {
    source: '/ar/car/city/cair..',
    destination: '/ar/car',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/car/audi/a7',
    destination: '/:locale/car/audi',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/car/ford/focus/forum',
    destination: '/:locale/car/ford/focus',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/car/honda/plereod',
    destination: '/:locale/car/honda',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/car/mitsubishi/306',
    destination: '/:locale/car/mitsubishi',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/car/nissan/selfy',
    destination: '/:locale/car/nissan',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/car/hyundai/xj',
    destination: '/:locale/car/hyundai',
    statusCode: 301,
  },
  {
    source: '/en/car/audi&quot',
    destination: '/en/car/audi',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/car/toyota/ophanza',
    destination: '/:locale/car/toyota',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/car/fiat/\\+nova',
    destination: '/:locale/car/fiat/nova',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/car/toyota/teresl',
    destination: '/:locale/car/toyota',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/car/skoda/viforit',
    destination: '/:locale/car/skoda',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/car/hummer/H-3',
    destination: '/:locale/car/hummer/h3',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/car/brilliance/kouper',
    destination: '/:locale/car/brilliance',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/car/mitsubishi/grandes',
    destination: '/:locale/car/mitsubishi',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/car/volks-wagen/peetle',
    destination: '/:locale/car/volks-wagen/beetle',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/car/kia/pride-Sedan',
    destination: '/:locale/car/kia',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/car/chevrolet/lanus',
    destination: '/:locale/car/chevrolet',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/car/toyota/starli',
    destination: '/:locale/car/toyota',
    statusCode: 301,
  },
  {
    source: '/en/car/toyota/teresl/1795',
    destination: '/en/car/toyota',
    statusCode: 301,
  },
  {
    source: '/ar/car/body/',
    destination: '/ar/car',
    statusCode: 301,
  },
  {
    source: '/ar/car/chevrolet/\\+sprint',
    destination: '/ar/car/chevrolet/sprint',
    statusCode: 301,
  },
  {
    source: '/ar/car/volks-wagen/forum',
    destination: '/ar/car/volks-wagen',
    statusCode: 301,
  },
  {
    source: '/ar/car/kia/pride-Sedan',
    destination: '/ar/car/kia/pride',
    statusCode: 301,
  },
  {
    source: '/ar/car/forum"',
    destination: '/ar/car',
    statusCode: 301,
  },
  {
    source: '/:locale(en|ar)/car/chevrolet/\\+sprint',
    destination: '/:locale/car/chevrolet/sprint',
    statusCode: 301,
  },
  // LEGACY REDIRECTS (2011-2012)
  {
    source: '/ar/car/volks-wagen/beetle/1587',
    destination: '/ar/car/volks-wagen/beetle/2691',
    statusCode: 301,
  },
  {
    source: '/ar/car/speranza[/QUOTE',
    destination: '/ar/car/speranza',
    statusCode: 301,
  },
  {
    source: '/ar/car/city/port..',
    destination: '/ar/car/city/port-said',
    statusCode: 301,
  },
  {
    source: '/ar/car/advenced-..',
    destination: '/ar/car',
    statusCode: 301,
  },
  // ROOT LEVEL AND CLEANUP REDIRECTS
  {
    source: '/v2.php',
    destination: '/',
    statusCode: 301,
  },
  {
    source: '/&quot',
    destination: '/ar/car',
    statusCode: 301,
  },
  // COUNTRY DOMAIN REDIRECTS (2012-09-25)
  {
    source: '/eg.hatla2ee.com',
    destination: '/news',
    statusCode: 301,
  },
  {
    source: '/ksa.hatla2ee.com',
    destination: '/news',
    statusCode: 301,
  },
  {
    source: '/uae.hatla2ee.com',
    destination: '/news',
    statusCode: 301,
  },
  {
    source: '/jordan.hatla2ee.com',
    destination: '/news',
    statusCode: 301,
  },
  {
    source: '/kuwait.hatla2ee.com',
    destination: '/news',
    statusCode: 301,
  },
  {
    source: '/qatar.hatla2ee.com',
    destination: '/news',
    statusCode: 301,
  },
];

// Tenant configuration exports
export const tenantRedirects = {
  eg: [...egRedirects, ...globalRedirects],
  ksa: globalRedirects,
  uae: globalRedirects,
  jordan: globalRedirects,
  qatar: globalRedirects,
  oman: globalRedirects,
  kuwait: globalRedirects,
};

// Helper function to get redirects for a specific tenant
export function getRedirectsForTenant(tenant) {
  return tenantRedirects[tenant] || globalRedirects;
}

// Export counts for verification
export const redirectCounts = {
  egSpecific: egRedirects.length, // 86 Egypt-specific redirects
  global: globalRedirects.length, // 161 global redirects
  totalEg: egRedirects.length + globalRedirects.length, // 247 total for Egypt
  totalOther: globalRedirects.length, // 161 for other tenants
};

/**
 * REDIRECT SUMMARY:
 * ================
 *
 * Original .htaccess: ~150+ RewriteRule statements
 * Your existing redirectsRulesMap: 247 redirects
 * This updated configuration: 247 redirects (86 Egypt-specific + 161 global)
 *
 * TENANT BREAKDOWN:
 * - Egypt (eg): 247 redirects (86 specific + 161 global)
 * - KSA: 161 redirects (global only)
 * - UAE: 161 redirects (global only)
 * - Jordan: 161 redirects (global only)
 * - Qatar: 161 redirects (global only)
 * - Oman: 161 redirects (global only)
 * - Kuwait: 161 redirects (global only)
 *
 * MISSING REDIRECTS FROM ORIGINAL .htaccess:
 * ------------------------------------------
 * The following redirects exist in .htaccess but were not in your redirectsRulesMap:
 *
 * 1. RewriteRule ^ar$ / [R=301,L]
 *    - Redirects /ar to root
 *
 * 2. RewriteRule ^\ $ / [R=301,L]
 *    - Redirects single space to root
 *
 * 3. RewriteRule ^ar/\*\*\*\*\.* /ar/car [R=301,L]
 *    - Redirects masked characters to /ar/car
 *
 * 4. RewriteRule ^ar/\*\*\*\*$ /ar/car [R=301,L]
 *    - Another masked character redirect
 *
 * 5. RewriteRule ^(.*)&quot$ /$1 [R=301,L]
 *    - Generic cleanup of &quot at end of URLs
 *
 * 6. RewriteRule ^((.*)+)/forum" /$1 [R=301,L]
 *    - Generic cleanup of /forum" at end of URLs
 *
 * 7. RewriteRule ^(.*)"$ /$1 [R=301,L]
 *    - Generic cleanup of " at end of URLs
 *
 * 8. Generic pattern: RewriteRule (ar|en)/car/(.*)/(.*)\.\. /$1/car/$2 [R=301,L]
 *    - Catchall for truncated URLs with ".."
 *
 * NOTE: Some of these are generic cleanup patterns that may be better handled
 * by Next.js middleware rather than explicit redirects, especially the quote
 * and character cleanup patterns.
 *
 * USAGE IN NEXT.JS:
 * -----------------
 * In your next.config.js:
 *
 * import { getRedirectsForTenant } from './redirects-config';
 *
 * const tenant = process.env.TENANT || 'eg';
 *
 * export default {
 *   async redirects() {
 *     return getRedirectsForTenant(tenant);
 *   }
 * }
 */

export const metaTranslationArabicMap = {
  'mazda-3': 'Mazda 3',
  'a-class': 'A  Class',
  'b-class': 'B  Class',
  'c-class': 'C  Class',
  'e-class': 'E  Class',
  'mazda-6': 'Mazda 6',
  cts: ' Cts',
  'e-420': 'E 420',
  a10: 'A10',
  tahoe: 'Taho',
  'swift-dzire': 'Dzire',
  evo: 'Evo',
  cla: 'CLA',
  vogue: 'Vogue',
  evoque: 'Evoque',
  sport: 'Sport',
  'mazda-2': 'Mazda 2',
  '2-series': '2 Serie',
  M50: 'M 50',
  'MG-360': 'MG 360',
  'Tucson-Turbo': 'Tucson Turbo',
  'creta-su2': 'Creta',
  Coaster: 'toyota',
  'BEIJING-X7': 'BEIJING X7',
  'FKP-37': 'FKP 37',
  'Tiggo-2-Pro': 'Tiggo 2 Pro ',
  'Shineray-X30': 'Shineray',
  'MG+One': 'MG One',
  'XUV-500': 'XUV500',
  'GS4+max': 'GS4max',
  'chery-qq': 'Chery qq',
  villager: 'Villager',
  foison: 'Foison',
  'changhe-ideal': 'Ideal',
  Emgrand: 'EMGRAND 5',
  'Song-Pro': 'Song pro',
  '-FKP+37.00': 'FKP 37.00',
  'Ct5-v+blackwing': 'ct5-v blackwing',
};

// Abandoned Pages Redirects Configuration for Next.js
// These use permanent: false for temporary redirects (307)
// Total redirects: 38

export const abandonedPagesRedirects = [
  // Home Screen redirects
  {
    source: '/:locale(en|ar)/car/top-car',
    destination: '/:locale',
    permanent: false,
  },
  {
    source: '/:locale(en|ar)/car-history-all',
    destination: '/:locale',
    permanent: false,
  },
  {
    source: '/:locale(en|ar)/car/outdated',
    destination: '/:locale',
    permanent: false,
  },
  {
    source: '/:locale(en|ar)/premium',
    destination: '/:locale',
    permanent: false,
  },
  {
    source: '/forum',
    destination: '/',
    permanent: false,
  },

  // New Cars Home redirects
  {
    source: '/:locale(en|ar)/car/newPremium',
    destination: '/:locale',
    permanent: false,
  },

  // Car Reviews redirects
  {
    source: '/:locale(en|ar)/car/advice/:path*',
    destination: '/:locale',
    permanent: false,
  },

  // Car News redirects
  {
    source: '/:locale(en|ar)/car/glossary/:path*',
    destination: '/:locale/news',
    permanent: false,
  },
  {
    source: '/:locale(en|ar)/car/offences',
    destination: '/:locale/news',
    permanent: false,
  },
  {
    source: '/:locale(en|ar)/car/alert',
    destination: `${BASE_URL}/news`,
    permanent: false,
  },

  // New Cars LPV (List Page View) redirects
  {
    source: '/:locale(en|ar)/new-car/electric',
    destination: '/:locale',
    permanent: false,
  },
  {
    source: '/:locale(en|ar)/new-car/hybrid',
    destination: '/:locale',
    permanent: false,
  },

  // Car Financing redirects
  {
    source: '/:locale(en|ar)/car/insurance/:path*',
    destination: '/:locale',
    permanent: false,
  },

  {
    source: '/:locale(en|ar)/new-car/offers/:path*',
    destination: '/:locale',
    permanent: false,
  },

  {
    source: '/:locale/:vehicleSection/search-available',
    destination: '/:locale/car/search?condition=new',
    permanent: false,
  },
];
