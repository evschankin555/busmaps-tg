import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLng } from '../../types/route';
import { MapMarker } from '../../types/map';
import './Map.css';

// Фикс для иконок маркеров в React-Leaflet
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}

interface MapProps {
  center?: LatLng;
  zoom?: number;
  markers?: MapMarker[];
  route?: LatLng[];
  onMapClick?: (latlng: LatLng) => void;
  onMarkerClick?: (markerId: string) => void;
  className?: string;
}

function MapController({ center, zoom, route }: { center?: LatLng; zoom?: number; route?: LatLng[] }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], zoom || map.getZoom());
    }
  }, [center, zoom, map]);

  useEffect(() => {
    if (route && route.length > 0) {
      try {
        const bounds = L.latLngBounds(route.map(p => [p.lat, p.lng] as [number, number]));
        map.fitBounds(bounds, { padding: [50, 50] });
      } catch (error) {
        console.error('Ошибка установки границ карты:', error);
      }
    }
  }, [route, map]);

  return null;
}

function MapClickHandler({ onMapClick }: { onMapClick?: (latlng: LatLng) => void }) {
  useMapEvents({
    click: (e) => {
      if (onMapClick) {
        onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
  });
  return null;
}

export function Map({
  center = { lat: 55.7558, lng: 37.6173 }, // Москва по умолчанию
  zoom = 13,
  markers = [],
  route,
  onMapClick,
  onMarkerClick,
  className = '',
}: MapProps) {
  const defaultCenter = center;

  return (
    <div className={`map-container ${className}`}>
      <MapContainer
        center={[defaultCenter.lat, defaultCenter.lng]}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
        touchZoom={true}
        doubleClickZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController center={center} zoom={zoom} route={route} />
        {onMapClick && <MapClickHandler onMapClick={onMapClick} />}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.position.lat, marker.position.lng]}
            eventHandlers={{
              click: () => {
                if (onMarkerClick) {
                  onMarkerClick(marker.id);
                }
              },
            }}
          />
        ))}
        {route && route.length > 1 && (
          <Polyline
            positions={route.map(p => [p.lat, p.lng])}
            color="#3b82f6"
            weight={5}
            opacity={0.7}
          />
        )}
      </MapContainer>
    </div>
  );
}

