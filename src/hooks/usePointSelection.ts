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
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/d8649f15-856d-44e5-9b57-dcabb0f6a1ef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'usePointSelection.ts:10',message:'selectPoint called',data:{latlng},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    setIsLoading(true);
    try {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/d8649f15-856d-44e5-9b57-dcabb0f6a1ef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'usePointSelection.ts:14',message:'Before reverseGeocode',data:{latlng},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      const result = await reverseGeocode(latlng.lat, latlng.lng);
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/d8649f15-856d-44e5-9b57-dcabb0f6a1ef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'usePointSelection.ts:17',message:'After reverseGeocode',data:{hasResult:!!result,displayName:result?.display_name},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      setSelectedPoint({
        position: latlng,
        name: result?.display_name,
        address: result?.display_name,
      });
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/d8649f15-856d-44e5-9b57-dcabb0f6a1ef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'usePointSelection.ts:23',message:'setSelectedPoint completed',data:{latlng},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/d8649f15-856d-44e5-9b57-dcabb0f6a1ef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'usePointSelection.ts:26',message:'selectPoint error',data:{error:error instanceof Error?error.message:String(error),latlng},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
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

