import React from 'react';
import { LatLng } from '../../types/route';
import './RouteHeader.css';

interface RouteHeaderProps {
  startPoint?: LatLng;
  endPoint?: LatLng;
  startName?: string;
  endName?: string;
  onStartClick?: () => void;
  onEndClick?: () => void;
  className?: string;
}

export function RouteHeader({
  startPoint,
  endPoint,
  startName,
  endName,
  onStartClick,
  onEndClick,
  className = '',
}: RouteHeaderProps) {
  return (
    <div className={`route-header ${className}`}>
      <div className="route-header-points">
        <button
          className={`route-header-point ${startPoint ? 'active' : ''}`}
          onClick={onStartClick}
          disabled={!onStartClick}
        >
          <div className="route-header-point-indicator start" />
          <div className="route-header-point-content">
            <div className="route-header-point-label">Откуда</div>
            <div className="route-header-point-value">
              {startName || (startPoint ? `${startPoint.lat.toFixed(4)}, ${startPoint.lng.toFixed(4)}` : 'Не выбрано')}
            </div>
          </div>
          {onStartClick && (
            <svg className="route-header-point-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          )}
        </button>
        <div className="route-header-divider" />
        <button
          className={`route-header-point ${endPoint ? 'active' : ''}`}
          onClick={onEndClick}
          disabled={!onEndClick}
        >
          <div className="route-header-point-indicator end" />
          <div className="route-header-point-content">
            <div className="route-header-point-label">Куда</div>
            <div className="route-header-point-value">
              {endName || (endPoint ? `${endPoint.lat.toFixed(4)}, ${endPoint.lng.toFixed(4)}` : 'Не выбрано')}
            </div>
          </div>
          {onEndClick && (
            <svg className="route-header-point-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

