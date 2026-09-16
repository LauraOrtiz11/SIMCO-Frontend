import { api } from '@/lib/axios';
import type {
  PileListItem,
  PileDetail,
  CreatePilePayload,
  UpdatePilePayload,
  PaginatedPileResponse,
  TelemetryReading,
} from '../types/pile.types';

// 1. Listar Pilas (con paginación y filtro por Invernadero)
export const getPiles = async (
  greenhouseId?: string,
  limit = 50,
  offset = 0,
): Promise<PaginatedPileResponse> => {
  const { data } = await api.get<PaginatedPileResponse>('/piles/', {
    params: {
      ...(greenhouseId ? { greenhouse_id: greenhouseId } : {}),
      limit,
      offset,
    },
  });
  return data;
};

// 2. Obtener detalle unificado por ID
export const getPileById = async (id: string): Promise<PileDetail> => {
  const { data } = await api.get<PileDetail>(`/piles/${id}`);
  return data;
};

// 3. Crear Pila
export const createPile = async (
  payload: CreatePilePayload,
): Promise<PileDetail> => {
  const { data } = await api.post<PileDetail>('/piles/', payload);
  return data;
};

// 4. Actualizar Pila
export const updatePile = async (
  id: string,
  payload: UpdatePilePayload,
): Promise<PileDetail> => {
  const { data } = await api.put<PileDetail>(`/piles/${id}`, payload);
  return data;
};

// 5. Asignar Dispositivo IoT / Nodo ESP32
export const assignDeviceToPile = async (
  pileId: string,
  deviceCode: string,
): Promise<{ message: string }> => {
  const { data } = await api.patch<{ message: string }>(
    `/piles/${pileId}/assign-device/${deviceCode}`,
  );
  return data;
};

// 6. Obtener Serie de Tiempo para Gráficos
export const getPileTelemetrySeries = async (
  pileCode: string,
  limit = 100,
): Promise<TelemetryReading[]> => {
  const { data } = await api.get<TelemetryReading[]>(
    `/piles/code/${pileCode}/telemetry`,
    {
      params: { limit },
    },
  );
  return data;
};
