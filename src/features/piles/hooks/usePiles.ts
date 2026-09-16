import { useState, useEffect, useCallback } from 'react';
import { getPiles, createPile, assignDeviceToPile } from '../api/pile.api';
import type { PileListItem, CreatePilePayload } from '../types/pile.types';

export const usePiles = (selectedGreenhouseId?: string) => {
  const [piles, setPiles] = useState<PileListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPiles = useCallback(async () => {
    if (!selectedGreenhouseId) {
      setPiles([]);
      setTotal(0);
      return;
    }
    try {
      setLoading(true);
      const data = await getPiles(selectedGreenhouseId);
      setPiles(data.items || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Error al cargar pilas:', error);
      setPiles([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [selectedGreenhouseId]);

  useEffect(() => {
    fetchPiles();
  }, [fetchPiles]);

  const handleCreatePile = async (payload: CreatePilePayload) => {
    try {
      setIsSubmitting(true);
      await createPile(payload);
      await fetchPiles();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignDevice = async (pileId: string, deviceCode: string) => {
    try {
      await assignDeviceToPile(pileId, deviceCode);
      await fetchPiles();
    } catch (error) {
      console.error('Error al asignar dispositivo:', error);
      throw error;
    }
  };

  return {
    piles,
    total,
    loading,
    isSubmitting,
    createPile: handleCreatePile,
    assignDevice: handleAssignDevice,
    refetch: fetchPiles,
  };
};
