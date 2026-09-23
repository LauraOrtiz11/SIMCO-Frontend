import { api } from '@/lib/axios';
import type {
  DeviceListItem,
  DeviceDetail,
  CreateDevicePayload,
  UpdateDevicePayload,
  PaginatedDeviceResponse,
  SensorType,
} from '../types/device.types';

// LISTAR DISPOSITIVOS (PAGINADO Y FILTRADO POR INVERNADERO)
export const getDevices = async (
  greenhouseId?: string,
  limit = 5,
  offset = 0,
): Promise<PaginatedDeviceResponse> => {
  const { data } = await api.get<PaginatedDeviceResponse>('/devices/', {
    params: {
      ...(greenhouseId ? { greenhouse_id: greenhouseId } : {}),
      limit,
      offset,
    },
  });
  return data;
};

//  OBTENER DETALLE DE DISPOSITIVO Y SENSORES POR ID
export const getDeviceById = async (id: string): Promise<DeviceDetail> => {
  const { data } = await api.get<DeviceDetail>(`/devices/${id}`);
  return data;
};

//  CREAR DISPOSITIVO
export const createDevice = async (
  payload: CreateDevicePayload,
): Promise<DeviceDetail> => {
  const { data } = await api.post<DeviceDetail>('/devices/', payload);
  return data;
};

//  ACTUALIZAR DISPOSITIVO
export const updateDevice = async (
  id: string,
  payload: UpdateDevicePayload,
): Promise<DeviceDetail> => {
  const { data } = await api.put<DeviceDetail>(`/devices/${id}`, payload);
  return data;
};

// CAMBIAR ESTADO DE DISPOSITIVO (ACTIVAR / DESACTIVAR)
export const toggleDeviceStatus = async (id: string): Promise<DeviceDetail> => {
  const { data } = await api.patch<DeviceDetail>(
    `/devices/${id}/toggle-status`,
  );
  return data;
};

//  CATÁLOGO DE TIPOS DE SENSORES
export const getSensorTypes = async (): Promise<SensorType[]> => {
  const { data } = await api.get<SensorType[]>('/devices/sensor-types');
  return data;
};
