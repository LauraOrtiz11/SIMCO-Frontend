import { useState, useEffect, useCallback } from 'react';
import {
  getPiles,
  createPile,
  updatePile,
  assignDeviceToPile,
} from '../api/pile.api';
import type {
  PileListItem,
  CreatePilePayload,
  UpdatePilePayload,
} from '../types/pile.types';

export const usePiles = (selectedGreenhouseId?: string) => {
  const [piles, setPiles] = useState<PileListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(4);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar lista de pilas
  const fetchPiles = useCallback(async () => {
    if (!selectedGreenhouseId) {
      setPiles([]);
      setTotal(0);
      return;
    }
    try {
      setLoading(true);
      const offset = (page - 1) * limit;
      const data = await getPiles(selectedGreenhouseId, limit, offset);
      setPiles(data.items || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Error cargando pilas de compostaje:', error);
      setPiles([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [selectedGreenhouseId, page, limit]);

  useEffect(() => {
    fetchPiles();
  }, [fetchPiles]);

  // Crear Pila
  const handleCreate = async (payload: CreatePilePayload) => {
    try {
      setIsSubmitting(true);
      await createPile(payload);
      await fetchPiles();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Editar / Actualizar Pila
  const handleUpdate = async (id: string, payload: UpdatePilePayload) => {
    try {
      setIsSubmitting(true);
      await updatePile(id, payload);
      await fetchPiles();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Asignar o Desvincular Dispositivo IoT
  const handleAssignDevice = async (
    pileId: string,
    deviceCode: string | null,
  ) => {
    try {
      setIsSubmitting(true);
      await assignDeviceToPile(pileId, deviceCode);
      await fetchPiles(); // Refrescar lista de pilas
    } catch (error) {
      console.error('Error al asignar dispositivo:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    piles,
    total,
    page,
    setPage,
    limit,
    loading,
    isSubmitting,
    createPile: handleCreate,
    updatePile: handleUpdate,
    assignDevice: handleAssignDevice,
    refetch: fetchPiles,
  };
};
