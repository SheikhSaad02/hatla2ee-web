import { apiClient } from '@/services/network/api-client';
import { convertQueryObjToString } from '@/utils/general';

const REQUEST_OPTIONS = { credentials: 'include', cache: 'no-store' };

export async function getUserMaintenanceCars() {
  return apiClient.get('/api/surge/user_maintenance_cars', REQUEST_OPTIONS);
}

export async function createUserMaintenanceCar(payload) {
  return apiClient.post(
    '/api/surge/user_maintenance_cars',
    { user_maintenance_car: payload },
    REQUEST_OPTIONS,
  );
}

export async function updateUserMaintenanceCar(id, payload) {
  return apiClient.patch(
    `/api/surge/user_maintenance_cars/${id}`,
    { user_maintenance_car: payload },
    REQUEST_OPTIONS,
  );
}

export async function deleteUserMaintenanceCar(id) {
  return apiClient.delete(
    `/api/surge/user_maintenance_cars/${id}`,
    REQUEST_OPTIONS,
  );
}

export async function getMaintenanceLogs(
  carId,
  { page = 1, perPage = 50 } = {},
) {
  const query = convertQueryObjToString({
    page,
    per_page: perPage,
    'q[user_maintenance_car_id_eq]': carId,
    'q[sorts]': 'id desc',
  });

  return apiClient.get(`/api/surge/maintenance_logs${query}`, REQUEST_OPTIONS);
}

export async function createMaintenanceLog(payload) {
  return apiClient.post(
    '/api/surge/maintenance_logs',
    { maintenance_log: payload },
    REQUEST_OPTIONS,
  );
}

export async function updateMaintenanceLog(id, payload) {
  return apiClient.patch(
    `/api/surge/maintenance_logs/${id}`,
    { maintenance_log: payload },
    REQUEST_OPTIONS,
  );
}

export async function deleteMaintenanceLog(id) {
  return apiClient.delete(`/api/surge/maintenance_logs/${id}`, REQUEST_OPTIONS);
}
