import React from 'react';
import './MapControls.css';

interface MapControlsProps {
  onMyLocation?: () => void;
  onFavorites?: () => void;
  onSelectPoint?: () => void;
}

export function MapControls({ onMyLocation, onFavorites, onSelectPoint }: MapControlsProps) {
  return (
    <div className="map-controls">
      {onMyLocation && (
        <button
          className="map-control-button"
          onClick={onMyLocation}
          aria-label="Моё местоположение"
          title="Моё местоположение"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="4" fill="currentColor" />
          </svg>
        </button>
      )}
      {onFavorites && (
        <button
          className="map-control-button"
          onClick={onFavorites}
          aria-label="Избранное"
          title="Избранное"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      )}
      {onSelectPoint && (
        <button
          className="map-control-button"
          onClick={onSelectPoint}
          aria-label="Выбрать точку на карте"
          title="Выбрать точку на карте"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </button>
      )}
    </div>
  );
}

