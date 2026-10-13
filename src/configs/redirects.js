import { appPaths } from '../constants/index.js';

const vehiclePaths = [
  appPaths['new-trucks'],
  appPaths['new-bus'],
  appPaths['new-motorcycle'],
];

function getVehicleRoutesRedirection(destination = '/:locale/new-car') {
  return vehiclePaths.map((path) => ({
    source: `/:locale${path}/:path*`,
    destination,
    permanent: true,
  }));
}

export const tenantRedirects = {
  eg: [],
  ksa: [...getVehicleRoutesRedirection()],
  uae: [...getVehicleRoutesRedirection()],
  jordan: [...getVehicleRoutesRedirection()],
  qatar: [...getVehicleRoutesRedirection()],
  oman: [...getVehicleRoutesRedirection('/:locale')],
  kuwait: [...getVehicleRoutesRedirection()],
};
