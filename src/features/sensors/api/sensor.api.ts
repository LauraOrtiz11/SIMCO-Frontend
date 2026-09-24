import { api } from '@/lib/axios';
import type {
  SensorListItem,
  CreateSensorPayload,
  UpdateSensorPayload,
  PaginatedSensorResponse,
} from '../types/sensor.types';

/**
 * Obtener lista paginada de sensores filtrada opcionalmente por nodo/dispositivo IoT
 * Paginación predeterminada fija a 5 filas
 */
export const getSensorsByDevice = async (
  deviceId?: string,
  limit = 5,
  offset = 0,
): Promise<PaginatedSensorResponse> => {
  const { data } = await api.get<PaginatedSensorResponse>('/sensors/', {
    params: {
      ...(deviceId ? { device_id: deviceId } : {}),
      limit,
      offset,
    },
  });
  return data;
};

/**
 * Registrar un nuevo sensor en la base de datos relacional
 */
export const createSensor = async (
  payload: CreateSensorPayload,
): Promise<SensorListItem> => {
  const { data } = await api.post<SensorListItem>('/sensors/', payload);
  return data;
};

/**
 * Actualizar la ubicación o parámetros de un sensor
 */
export const updateSensor = async (
  id: string,
  payload: UpdateSensorPayload,
): Promise<SensorListItem> => {
  const { data } = await api.put<SensorListItem>(`/sensors/${id}`, payload);
  return data;
};

/**
 * Alternar estado lógico (Activar / Desactivar) del sensor
 */
export const toggleSensorStatus = async (
  id: string,
): Promise<SensorListItem> => {
  const { data } = await api.patch<SensorListItem>(
    `/sensors/${id}/toggle-status`,
  );
  return data;
};
