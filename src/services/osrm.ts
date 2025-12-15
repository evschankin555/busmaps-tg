import axios from 'axios';
import { LatLng, Route } from '../types/route';

const OSRM_API_URL = 'https://router.project-osrm.org/route/v1';

export async function buildRoute(start: LatLng, end: LatLng): Promise<Route> {
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/d8649f15-856d-44e5-9b57-dcabb0f6a1ef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'osrm.ts:5',message:'buildRoute called',data:{start,end},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  try {
    const url = `${OSRM_API_URL}/walking/${start.lng},${start.lat};${end.lng},${end.lat}`;
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/d8649f15-856d-44e5-9b57-dcabb0f6a1ef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'osrm.ts:9',message:'Before OSRM API call',data:{url,start,end},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    const response = await axios.get(url, {
      params: {
        overview: 'full',
        geometries: 'geojson',
        steps: true,
      },
    });
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/d8649f15-856d-44e5-9b57-dcabb0f6a1ef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'osrm.ts:18',message:'OSRM API response received',data:{hasRoutes:!!response.data.routes,routesCount:response.data.routes?.length,code:response.data.code},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion

    const route = response.data.routes[0];
    if (!route) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/d8649f15-856d-44e5-9b57-dcabb0f6a1ef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'osrm.ts:24',message:'No route found in response',data:{responseData:response.data},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      throw new Error('Маршрут не найден');
    }

    // Преобразуем GeoJSON координаты в LatLng
    const geometry = route.geometry.coordinates.map((coord: [number, number]) => ({
      lng: coord[0],
      lat: coord[1],
    }));
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/d8649f15-856d-44e5-9b57-dcabb0f6a1ef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'osrm.ts:32',message:'Route built successfully',data:{distance:route.distance,duration:route.duration,geometryLength:geometry.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion

    return {
      start,
      end,
      distance: route.distance,
      duration: route.duration,
      geometry,
    };
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/d8649f15-856d-44e5-9b57-dcabb0f6a1ef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'osrm.ts:45',message:'buildRoute error',data:{error:error instanceof Error?error.message:String(error),axiosError:axios.isAxiosError(error)?{status:error.response?.status,data:error.response?.data}:null,start,end},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    console.error('Ошибка построения маршрута:', error);
    throw error;
  }
}

