import React from 'react';
import { BottomPanel } from '../BottomPanel/BottomPanel';
import { RouteInfo } from './RouteInfo';
import { Route } from '../../types/route';
import './RoutePanel.css';

interface RoutePanelProps {
  route: Route;
  onClose?: () => void;
  onStartNavigation?: () => void;
  onShare?: () => void;
  onSave?: () => void;
  isLoading?: boolean;
}

export function RoutePanel({
  route,
  onClose,
  onStartNavigation,
  onShare,
  onSave,
  isLoading,
}: RoutePanelProps) {
  if (isLoading) {
    return (
      <BottomPanel className="route-panel" onClose={onClose}>
        <div className="route-panel-loading">Построение маршрута...</div>
      </BottomPanel>
    );
  }

  return (
    <BottomPanel className="route-panel" onClose={onClose}>
      <RouteInfo
        route={route}
        onStartNavigation={onStartNavigation}
        onShare={onShare}
        onSave={onSave}
      />
    </BottomPanel>
  );
}

