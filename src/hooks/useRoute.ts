import { useState, useCallback } from 'react';
import { LatLng, Route } from '../types/route';
import { buildRoute } from '../services/osrm';

export function useRoute() {
  const [route, setRoute] = useState<Route | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateRoute = useCallback(async (start: LatLng, end: LatLng) => {
    setIsLoading(true);
    setError(null);
    try {
      const newRoute = await buildRoute(start, end);
      setRoute(newRoute);
      return newRoute;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка построения маршрута';
      setError(errorMessage);
      setRoute(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearRoute = useCallback(() => {
    setRoute(null);
    setError(null);
  }, []);

  return {
    route,
    isLoading,
    error,
    calculateRoute,
    clearRoute,
  };
}

