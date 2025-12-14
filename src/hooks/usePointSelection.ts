import { useState, useCallback } from 'react';
import { LatLng } from '../types/route';
import { reverseGeocode } from '../services/nominatim';

export interface SelectedPoint {
  position: LatLng;
  name?: string;
  address?: string;
}

export function usePointSelection() {
  const [selectedPoint, setSelectedPoint] = useState<SelectedPoint | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const selectPoint = useCallback(async (latlng: LatLng) => {
    setIsLoading(true);
    try {
      const result = await reverseGeocode(latlng.lat, latlng.lng);
      setSelectedPoint({
        position: latlng,
        name: result?.display_name,
        address: result?.display_name,
      });
    } catch (error) {
      console.error('Ошибка получения адреса:', error);
      setSelectedPoint({
        position: latlng,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedPoint(null);
  }, []);

  return {
    selectedPoint,
    isLoading,
    selectPoint,
    clearSelection,
  };
}

