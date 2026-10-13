import { getMaintenanceLogs, getUserMaintenanceCars } from '@/apis/maintenance';
import { mapUserMaintenanceCar } from '@/mappers/userMaintenanceCars';

export const MAX_MAINTENANCE_CARS = 5;

export async function fetchMappedUserMaintenanceCars(locale, t) {
  const response = await getUserMaintenanceCars();

  if (response?.error) {
    return { cars: [], error: response.error };
  }

  const cars = (response?.user_maintenance_cars || []).map((car) =>
    mapUserMaintenanceCar(car, locale, t),
  );

  return { cars, error: null };
}

export async function fetchCarServiceDetails(carId, locale, t) {
  if (!carId) {
    return { car: null, logs: [] };
  }

  const [carsResult, logsResponse] = await Promise.all([
    fetchMappedUserMaintenanceCars(locale, t),
    getMaintenanceLogs(carId),
  ]);

  if (carsResult.error) {
    return { car: null, logs: [] };
  }

  const car = carsResult.cars.find(
    (item) => String(item.id) === String(carId),
  );

  if (!car) {
    return { car: null, logs: [] };
  }

  const logs = logsResponse?.error ? [] : logsResponse?.maintenance_logs || [];

  return { car, logs };
}
