export interface LatLng {
  lat: number;
  lng: number;
}

export interface Route {
  start: LatLng;
  end: LatLng;
  distance: number; // в метрах
  duration: number; // в секундах
  geometry: LatLng[]; // точки маршрута для отрисовки
  instructions?: RouteInstruction[];
}

export interface RouteInstruction {
  distance: number;
  duration: number;
  instruction: string;
  type: string;
}

export interface RoutePoint {
  position: LatLng;
  name?: string;
  address?: string;
}

