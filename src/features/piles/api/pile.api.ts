import { api } from '@/lib/axios';
import type {
  PileListItem,
  PileDetail,
  CreatePilePayload,
  UpdatePilePayload,
  PaginatedPileResponse,
} from '../types/pile.types';

export const getPiles = async (
  greenhouseId?: string,
  limit = 4,
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

export const getPileById = async (id: string): Promise<PileDetail> => {
  const { data } = await api.get<PileDetail>(`/piles/${id}`);
  return data;
};

export const createPile = async (
  payload: CreatePilePayload,
): Promise<PileDetail> => {
  const { data } = await api.post<PileDetail>('/piles/', payload);
  return data;
};

export const updatePile = async (
  id: string,
  payload: UpdatePilePayload,
): Promise<PileDetail> => {
  const { data } = await api.put<PileDetail>(`/piles/${id}`, payload);
  return data;
};

export const assignDeviceToPile = async (
  pileId: string,
  deviceCode: string | null,
): Promise<PileDetail> => {
  const { data } = await api.patch<PileDetail>(
    `/piles/${pileId}/assign-device`,
    {
      device_code: deviceCode,
    },
  );
  return data;
};

export interface TelemetryPoint {
  timestamp: string;
  readings: {
    internal_temperature?: number;
    ambient_temperature?: number;
    humidity?: number;
    ph?: number;
  };
}
export const getPileTelemetrySeries = async (
  pileCode: string,
  limit = 50,
): Promise<TelemetryPoint[]> => {
  const { data } = await api.get<TelemetryPoint[]>(
    `/piles/${pileCode}/telemetry`,
    {
      params: { limit },
    },
  );
  return data;
};
