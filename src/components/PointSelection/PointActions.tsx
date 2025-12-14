import React from 'react';
import './PointActions.css';

interface PointActionsProps {
  onNavigate?: () => void;
  onAddToFavorites?: () => void;
  onSearchNearby?: () => void;
  onCallTaxi?: () => void;
}

export function PointActions({
  onNavigate,
  onAddToFavorites,
  onSearchNearby,
  onCallTaxi,
}: PointActionsProps) {
  return (
    <div className="point-actions">
      {onNavigate && (
        <button className="point-action-button primary" onClick={onNavigate}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          Начать навигацию
        </button>
      )}
      <div className="point-actions-row">
        {onAddToFavorites && (
          <button className="point-action-button" onClick={onAddToFavorites}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Избранное
          </button>
        )}
        {onSearchNearby && (
          <button className="point-action-button" onClick={onSearchNearby}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            Рядом
          </button>
        )}
        {onCallTaxi && (
          <button className="point-action-button" onClick={onCallTaxi}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1" />
              <path d="M12 15l5-5-5-5" />
              <path d="M17 10H7" />
            </svg>
            Такси
          </button>
        )}
      </div>
    </div>
  );
}

