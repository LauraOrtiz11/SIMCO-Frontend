import { useState, useEffect, useCallback } from 'react';
import {
  getDevices,
  createDevice,
  updateDevice,
  toggleDeviceStatus as toggleDeviceApi,
} from '../api/device.api';
import type {
  DeviceListItem,
  CreateDevicePayload,
  UpdateDevicePayload,
} from '../types/device.types';

export const useDevices = (selectedGreenhouseId?: string) => {
  const [devices, setDevices] = useState<DeviceListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(3);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar lista paginada
  const fetchDevices = useCallback(async () => {
    if (!selectedGreenhouseId) {
      setDevices([]);
      setTotal(0);
      return;
    }
    try {
      setLoading(true);
      const offset = (page - 1) * limit;
      const data = await getDevices(selectedGreenhouseId, limit, offset);
      setDevices(data.items || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Error cargando dispositivos:', error);
      setDevices([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [selectedGreenhouseId, page, limit]);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  // Handler para crear
  const handleCreate = async (payload: CreateDevicePayload) => {
    try {
      setIsSubmitting(true);
      await createDevice(payload);
      await fetchDevices();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler para actualizar
  const handleUpdate = async (id: string, payload: UpdateDevicePayload) => {
    try {
      setIsSubmitting(true);
      await updateDevice(id, payload);
      await fetchDevices();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler para activar/desactivar afectando solo a la fila modificada
  const handleToggle = async (id: string) => {
    const updatedDevice = await toggleDeviceApi(id);

    setDevices((prevDevices) =>
      prevDevices.map((device) =>
        device.id_device === id
          ? { ...device, is_active: updatedDevice.is_active }
          : device,
      ),
    );
  };

  return {
    devices,
    total,
    page,
    setPage,
    limit,
    loading,
    isSubmitting,
    createDevice: handleCreate,
    updateDevice: handleUpdate,
    toggleDeviceStatus: handleToggle,
    refetch: fetchDevices,
  };
};
