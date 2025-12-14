import { useEffect, useState, useCallback } from 'react';
import { init } from '@twa-dev/sdk';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { useAppState } from './hooks/useAppState';
import { AppViewState } from './state/AppState';
import { Map } from './components/Map/Map';
import { MapControls } from './components/Map/MapControls';
import { SearchBar } from './components/Search/SearchBar';
import { PointInfoPanel } from './components/PointSelection/PointInfoPanel';
import { RouteHeader } from './components/Route/RouteHeader';
import { RoutePanel } from './components/Route/RoutePanel';
import { PointEditingPanel } from './components/PointEditing/PointEditingPanel';
import { usePointSelection } from './hooks/usePointSelection';
import { useRoute } from './hooks/useRoute';
import { MapMarker } from './types/map';
import { LatLng } from './types/route';
import { useSearch } from './hooks/useSearch';
import { SearchResults } from './components/Search/SearchResults';
import { SearchHistory } from './components/Search/SearchHistory';
import { QuickActions, QuickAction } from './components/Search/QuickActions';
import { searchResultToLatLng, SearchResult } from './services/nominatim';
import './App.css';
import './types/telegram';

function AppContent() {
  const { currentState, updateState } = useNavigation();
  const {
    goToHome,
    goToPointSelection,
    goToRoutePlanning,
    goToPointEditing,
    goToNavigation,
    goToSearch,
    handleBack,
  } = useAppState();

  const { selectedPoint, isLoading: pointLoading, selectPoint, clearSelection } = usePointSelection();
  const { route, isLoading: routeLoading, calculateRoute, clearRoute } = useRoute();
  const { query, results, isLoading: searchLoading, history, search, selectResult, selectHistoryItem } = useSearch();

  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);
  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>([]);

  useEffect(() => {
    init();
  }, []);

  // Обновление маркеров на карте
  useEffect(() => {
    const markers: MapMarker[] = [];
    
    if (currentState.selectedPoint) {
      markers.push({
        id: 'selected',
        position: currentState.selectedPoint,
        type: 'selected',
      });
    }
    
    if (currentState.startPoint) {
      markers.push({
        id: 'start',
        position: currentState.startPoint,
        type: 'start',
      });
    }
    
    if (currentState.endPoint) {
      markers.push({
        id: 'end',
        position: currentState.endPoint,
        type: 'end',
      });
    }
    
    setMapMarkers(markers);
  }, [currentState.selectedPoint, currentState.startPoint, currentState.endPoint]);

  // Построение маршрута при изменении точек
  useEffect(() => {
    if (currentState.currentView === AppViewState.ROUTE_PLANNING && currentState.startPoint && currentState.endPoint) {
      calculateRoute(currentState.startPoint, currentState.endPoint)
        .then((newRoute) => {
          updateState({ route: newRoute });
        })
        .catch((error) => {
          console.error('Ошибка построения маршрута:', error);
        });
    }
  }, [currentState.currentView, currentState.startPoint, currentState.endPoint, calculateRoute, updateState]);

  const handleMapClick = useCallback((latlng: LatLng) => {
    if (currentState.currentView === AppViewState.HOME || currentState.currentView === AppViewState.POINT_SELECTION) {
      selectPoint(latlng);
      goToPointSelection(latlng);
    }
  }, [currentState.currentView, selectPoint, goToPointSelection]);

  const handleMyLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc: LatLng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(loc);
          selectPoint(loc);
          goToPointSelection(loc);
        },
        (error) => {
          console.error('Ошибка получения местоположения:', error);
        }
      );
    }
  }, [selectPoint, goToPointSelection]);

  const handlePointSelected = useCallback((point: LatLng) => {
    if (!currentState.startPoint) {
      updateState({ startPoint: point });
    } else if (!currentState.endPoint) {
      updateState({ endPoint: point });
      goToRoutePlanning(currentState.startPoint, point);
    } else {
      // Заменяем конечную точку
      updateState({ endPoint: point });
      goToRoutePlanning(currentState.startPoint, point);
    }
  }, [currentState.startPoint, updateState, goToRoutePlanning]);

  const handleSearchFocus = useCallback(() => {
    goToSearch();
  }, [goToSearch]);

  const handleSearchSelect = useCallback((result: SearchResult) => {
    const latlng = searchResultToLatLng(result);
    selectResult(result);
    
    if (currentState.currentView === AppViewState.SEARCH) {
      if (!currentState.startPoint) {
        updateState({ startPoint: latlng });
        goToHome();
      } else if (!currentState.endPoint) {
        updateState({ endPoint: latlng });
        goToRoutePlanning(currentState.startPoint, latlng);
      } else {
        // Выбираем точку для редактирования
        handlePointSelected(latlng);
      }
    }
  }, [currentState, selectResult, updateState, goToHome, goToRoutePlanning, handlePointSelected]);

  const handlePointEdit = useCallback((pointType: 'start' | 'end') => {
    goToPointEditing(pointType);
  }, [goToPointEditing]);

  const handlePointEditSelect = useCallback((latlng: LatLng) => {
    if (currentState.editingPointType === 'start') {
      updateState({ startPoint: latlng });
      if (currentState.endPoint) {
        goToRoutePlanning(latlng, currentState.endPoint);
      } else {
        goToHome();
      }
    } else if (currentState.editingPointType === 'end') {
      updateState({ endPoint: latlng });
      if (currentState.startPoint) {
        goToRoutePlanning(currentState.startPoint, latlng);
      } else {
        goToHome();
      }
    }
  }, [currentState.editingPointType, updateState, goToRoutePlanning, goToHome]);

  const handleStartNavigation = useCallback(() => {
    if (route) {
      goToNavigation();
    }
  }, [route, goToNavigation]);

  const quickActions: QuickAction[] = [
    ...(currentLocation
      ? [
          {
            id: 'my-location',
            label: 'Моё местоположение',
            icon: (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="4" fill="currentColor" />
              </svg>
            ),
          },
        ]
      : []),
    {
      id: 'favorites',
      label: 'Избранное',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
    },
  ];

  const handleQuickAction = useCallback((action: QuickAction) => {
    if (action.id === 'my-location' && currentLocation) {
      selectPoint(currentLocation);
      goToPointSelection(currentLocation);
    }
  }, [currentLocation, selectPoint, goToPointSelection]);

  const handleHistorySelect = useCallback((item: typeof history[0]) => {
    if (item.result) {
      handleSearchSelect({
        display_name: item.result.display_name,
        lat: item.result.lat.toString(),
        lon: item.result.lng.toString(),
        place_id: 0,
        type: '',
      } as SearchResult);
    } else {
      selectHistoryItem(item);
    }
  }, [history, handleSearchSelect, selectHistoryItem]);

  return (
    <div className="app">
      <Map
        center={currentLocation || { lat: 55.7558, lng: 37.6173 }}
        markers={mapMarkers}
        route={route?.geometry}
        onMapClick={handleMapClick}
      />
      
      {currentState.currentView === AppViewState.HOME && (
        <>
          <SearchBar onFocus={handleSearchFocus} onSearch={search} />
          <MapControls
            onMyLocation={handleMyLocation}
            onSelectPoint={() => goToPointSelection()}
          />
        </>
      )}

      {currentState.currentView === AppViewState.SEARCH && (
        <div className="search-overlay">
          <SearchBar value={query} onSearch={search} />
          {query ? (
            <SearchResults
              results={results}
              isLoading={searchLoading}
              onSelect={handleSearchSelect}
            />
          ) : (
            <>
              <QuickActions actions={quickActions} onSelect={handleQuickAction} />
              {history.length > 0 && (
                <SearchHistory history={history} onSelect={handleHistorySelect} />
              )}
            </>
          )}
        </div>
      )}

      {currentState.currentView === AppViewState.POINT_SELECTION && selectedPoint && (
        <PointInfoPanel
          point={selectedPoint}
          onClose={handleBack}
          onNavigate={() => {
            if (currentState.startPoint) {
              handlePointSelected(selectedPoint.position);
            } else {
              handlePointSelected(selectedPoint.position);
            }
          }}
          isLoading={pointLoading}
        />
      )}

      {currentState.currentView === AppViewState.ROUTE_PLANNING && (
        <>
          <RouteHeader
            startPoint={currentState.startPoint}
            endPoint={currentState.endPoint}
            onStartClick={() => handlePointEdit('start')}
            onEndClick={() => handlePointEdit('end')}
          />
          {route && (
            <RoutePanel
              route={route}
              onStartNavigation={handleStartNavigation}
              isLoading={routeLoading}
            />
          )}
        </>
      )}

      {currentState.currentView === AppViewState.POINT_EDITING && (
        <PointEditingPanel
          pointType={currentState.editingPointType || 'start'}
          onClose={handleBack}
          onSelect={handlePointEditSelect}
          currentLocation={currentLocation || undefined}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <NavigationProvider>
      <AppContent />
    </NavigationProvider>
  );
}

export default App;
