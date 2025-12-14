import axios from 'axios';
import { LatLng, Route } from '../types/route';

const OSRM_API_URL = 'https://router.project-osrm.org/route/v1';

export async function buildRoute(start: LatLng, end: LatLng): Promise<Route> {
  try {
    const response = await axios.get(`${OSRM_API_URL}/walking/${start.lng},${start.lat};${end.lng},${end.lat}`, {
      params: {
        overview: 'full',
        geometries: 'geojson',
        steps: true,
      },
    });

    const route = response.data.routes[0];
    if (!route) {
      throw new Error('Маршрут не найден');
    }

    // Преобразуем GeoJSON координаты в LatLng
    const geometry = route.geometry.coordinates.map((coord: [number, number]) => ({
      lng: coord[0],
      lat: coord[1],
    }));

    return {
      start,
      end,
      distance: route.distance,
      duration: route.duration,
      geometry,
    };
  } catch (error) {
    console.error('Ошибка построения маршрута:', error);
    throw error;
  }
}

