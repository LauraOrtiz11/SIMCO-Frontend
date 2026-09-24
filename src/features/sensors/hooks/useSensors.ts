import { useState, useEffect, useCallback } from 'react';
import {
  getSensorsByDevice,
  createSensor,
  updateSensor,
  toggleSensorStatus,
} from '../api/sensor.api';
import type {
  SensorListItem,
  CreateSensorPayload,
  UpdateSensorPayload,
} from '../types/sensor.types';

export const useSensors = (selectedDeviceId?: string) => {
  const [sensors, setSensors] = useState<SensorListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(5); // Paginación fija de 5 elementos
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSensors = useCallback(async () => {
    if (!selectedDeviceId) {
      setSensors([]);
      setTotal(0);
      return;
    }
    try {
      setLoading(true);
      const offset = (page - 1) * limit;
      const data = await getSensorsByDevice(selectedDeviceId, limit, offset);
      setSensors(data.items || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Error cargando sensores:', error);
      setSensors([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [selectedDeviceId, page, limit]);

  useEffect(() => {
    fetchSensors();
  }, [fetchSensors]);

  const handleCreate = async (payload: CreateSensorPayload) => {
    try {
      setIsSubmitting(true);
      await createSensor(payload);
      await fetchSensors();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (id: string, payload: UpdateSensorPayload) => {
    try {
      setIsSubmitting(true);
      await updateSensor(id, payload);
      await fetchSensors();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleSensorStatus(id);
      await fetchSensors();
    } catch (error) {
      console.error('Error alternando estado del sensor:', error);
    }
  };

  return {
    sensors,
    total,
    page,
    setPage,
    limit,
    loading,
    isSubmitting,
    createSensor: handleCreate,
    updateSensor: handleUpdate,
    toggleSensorStatus: handleToggleStatus,
    refetch: fetchSensors,
  };
};
