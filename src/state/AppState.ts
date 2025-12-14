import { LatLng, Route } from '../types/route';

export enum AppViewState {
  HOME = 'home',                    // Главный экран с картой
  POINT_SELECTION = 'point_selection', // Выбор точки на карте
  ROUTE_PLANNING = 'route_planning',   // Построение маршрута
  POINT_EDITING = 'point_editing',     // Редактирование точки маршрута
  NAVIGATION = 'navigation',           // Активная навигация
  SEARCH = 'search'                    // Поиск адресов
}

export interface AppState {
  currentView: AppViewState;
  selectedPoint?: LatLng;
  route?: Route;
  editingPointType?: 'start' | 'end';
  searchQuery?: string;
  startPoint?: LatLng;
  endPoint?: LatLng;
}

export interface NavigationHistoryEntry {
  view: AppViewState;
  state: Partial<AppState>;
  timestamp: number;
}

