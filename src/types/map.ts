import { LatLng } from './route';

export interface MapMarker {
  id: string;
  position: LatLng;
  type: 'start' | 'end' | 'selected' | 'poi';
  title?: string;
  description?: string;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

