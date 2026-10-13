export const Routes = {
  // Home - landing
  home: '/',
  homeLocalized: '/:locale(ar|en)',

  // Used cars routes - from src/services/urlValidator/usedCarsListings.js
  usedCars: '/:locale/car',
  usedCarsSearch: '/:locale/car/search',
  usedCarDetail: '/:locale/car/:make/:model/:id',

  // Used car info and listing pages
  usedCarInfo: '/:locale/car/info',
  usedCarInfoMake: '/:locale/car/info/:make',
  usedCarCities: '/:locale/car/cities',
  usedCarMakes: '/:locale/car/makes',
  usedCarModels: '/:locale/car/models',

  // Used car prices routes
  // Wildcard pattern matches all /car/used-prices/* routes (cached by default)
  usedCarPrices: '/:locale/car/used-prices/:path*',

  // Explicit get-offer route - MUST come AFTER wildcard in cache config
  // Next.js uses LAST-match-wins, so this will override the wildcard for this specific URL
  usedCarPricesEvaluateGetOffer: '/:locale/car/used-prices/evaluate/get-offer',

  // City filters
  usedCarsCity: '/:locale/car/city/:city',
  usedCarsCityBody: '/:locale/car/city/:city/body/:body',
  usedCarsCityMake: '/:locale/car/city/:city/:make',
  usedCarsCityMakeModel: '/:locale/car/city/:city/:make/:model',

  // Make/Model filters
  usedCarsMake: '/:locale/car/:make',
  usedCarsMakeModel: '/:locale/car/:make/:model',
  usedCarsMakeModelYear: '/:locale/car/:make/:model/year/:year',
  usedCarsMakeModelTeraz: '/:locale/car/:make/:model/teraz/:id',

  // Other filters
  usedCarsBody: '/:locale/car/body/:body',
  usedCarsPriceLimit: '/:locale/car/price-limit/:price',
  usedCarsCC: '/:locale/car/cc/:cc',

  // Special routes
  usedCarsKasrZero: '/:locale/car/kasr-zero',
  usedCarsTaxi: '/:locale/car/taxi',

  usedCarsDisabled: '/:locale/car/disabled',
  usedCarsHybrid: '/:locale/car/hybrid',
  usedCarsClassic: '/:locale/car/classic',
  usedCarsElectric: '/:locale/car/electric',
  usedCarsFinanced: '/:locale/car/used-car-financed',

  // Imported cars routes (Egypt only)
  importedCar: '/:locale/imported-car/:path*',
  importedCarUsed: '/:locale/imported',
  importedCarNew: '/:locale/new-car/imported/:path*',
  importedCarDetail: '/:locale/new-car/imported/:make/:model/:id',

  // New cars routes
  newCars: '/:locale/new-car',
  newCarsSearch: '/:locale/new-car/search',
  newCarsMake: '/:locale/new-car/:make',
  newCarsMakeModel: '/:locale/new-car/:make/:model',
  newCarsVariant: '/:locale/new-car/:make/:model/:variantId',
  newCarDetail: '/:locale/new-car/:make/:model/:variantId/:id',
  newCarsPriceLimit: '/:locale/new-car/price-limit/:price',
  newCarsBody: '/:locale/new-car/body/:body',
  newCarsOffers: '/:locale/new-car/offers',
  newCarsAssembled: '/:locale/new-car/assembled/:path*',
  newCarsOrigin: '/:locale/new-car/origin/:path*',

  // New car prices (Oman not included - VEHICLE_PRICES section)
  newCarPrices: '/:locale/car/all-prices/:path*',
  newCarPriceByMake: '/:locale/car/price/:make',
  newCarPricesRangeTo: '/:locale/car/prices-range/to/:max',
  newCarPricesRangeFrom: '/:locale/car/prices-range/from/:min',
  newCarPricesRange: '/:locale/car/prices/range/:min/:max',

  // New car price changes (Egypt only)
  newCarPriceChanges: '/:locale/new-car/price-change/:path*',

  // New Trucks routes (Egypt only) - using wildcards
  newTrucks: '/:locale/new-trucks/:path*',
  newTrucksPrices: '/:locale/trucks/all-prices/:path*',

  // New Bus routes (Egypt only) - using wildcards
  newBus: '/:locale/new-bus/:path*',
  newBusPrices: '/:locale/bus/all-prices/:path*',

  // New Motorcycle routes (Egypt only) - using wildcards
  newMotorcycle: '/:locale/new-motorcycle/:path*',
  newMotorcyclePrices: '/:locale/motorcycle/all-prices/:path*',

  // Egypt-only routes
  carFinance: '/:locale/car-finance/:path*',
  newCarCompare: '/:locale/new-car/compare/:path*',
  showroom: '/:locale/showroom/:path*',
  showroomNew: '/:locale/showroom-new/:path*',
  showroomAuthorized: '/:locale/showroom-authorized/:path*',
  review: '/:locale/review/:path*',
  maintenanceCenter: '/:locale/maintenances-center/:path*',
  myMaintenance: '/:locale/car-maintenance',
  roadsideAssistance: '/:locale/roadside-assistance/:path*',
  carSelection: '/:locale/car-selection',

  // Static/info pages
  contactUs: '/:locale/contact-us',
  termsAndConditions: '/:locale/general-condition',
  privacy: '/:locale/privacy',
};
