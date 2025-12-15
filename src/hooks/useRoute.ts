import { useState, useCallback } from 'react';
import { LatLng, Route } from '../types/route';
import { buildRoute } from '../services/osrm';

export function useRoute() {
  const [route, setRoute] = useState<Route | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateRoute = useCallback(async (start: LatLng, end: LatLng) => {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/d8649f15-856d-44e5-9b57-dcabb0f6a1ef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useRoute.ts:10',message:'calculateRoute called',data:{start,end},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    setIsLoading(true);
    setError(null);
    try {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/d8649f15-856d-44e5-9b57-dcabb0f6a1ef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useRoute.ts:15',message:'Before buildRoute API call',data:{start,end},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      const newRoute = await buildRoute(start, end);
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/d8649f15-856d-44e5-9b57-dcabb0f6a1ef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useRoute.ts:17',message:'buildRoute API success',data:{hasRoute:!!newRoute,distance:newRoute.distance,duration:newRoute.duration,geometryLength:newRoute.geometry?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      setRoute(newRoute);
      return newRoute;
    } catch (err) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/d8649f15-856d-44e5-9b57-dcabb0f6a1ef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useRoute.ts:22',message:'buildRoute API error',data:{error:err instanceof Error?err.message:String(err),start,end},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
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

