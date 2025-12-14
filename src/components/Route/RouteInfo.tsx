import React from 'react';
import { Route } from '../../types/route';
import './RouteInfo.css';

interface RouteInfoProps {
  route: Route;
  onStartNavigation?: () => void;
  onShare?: () => void;
  onSave?: () => void;
  className?: string;
}

function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} м`;
  }
  return `${(meters / 1000).toFixed(1)} км`;
}

function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return `${minutes} мин`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours} ч ${mins} мин` : `${hours} ч`;
}

export function RouteInfo({
  route,
  onStartNavigation,
  onShare,
  onSave,
  className = '',
}: RouteInfoProps) {
  return (
    <div className={`route-info ${className}`}>
      <div className="route-info-stats">
        <div className="route-info-stat">
          <div className="route-info-stat-value">{formatDistance(route.distance)}</div>
          <div className="route-info-stat-label">Расстояние</div>
        </div>
        <div className="route-info-stat">
          <div className="route-info-stat-value">{formatDuration(route.duration)}</div>
          <div className="route-info-stat-label">Время</div>
        </div>
      </div>
      <div className="route-info-actions">
        {onStartNavigation && (
          <button className="route-info-action-button primary" onClick={onStartNavigation}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            Начать навигацию
          </button>
        )}
        <div className="route-info-action-row">
          {onShare && (
            <button className="route-info-action-button" onClick={onShare}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              Поделиться
            </button>
          )}
          {onSave && (
            <button className="route-info-action-button" onClick={onSave}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Сохранить
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

