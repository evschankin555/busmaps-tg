import React from 'react';
import { BottomPanel } from '../BottomPanel/BottomPanel';
import { SearchBar } from '../Search/SearchBar';
import { SearchResults } from '../Search/SearchResults';
import { SearchHistory } from '../Search/SearchHistory';
import { QuickActions, QuickAction } from '../Search/QuickActions';
import { useSearch } from '../../hooks/useSearch';
import { SearchResult, searchResultToLatLng } from '../../services/nominatim';
import './PointEditingPanel.css';

interface PointEditingPanelProps {
  pointType: 'start' | 'end';
  onClose?: () => void;
  onSelect: (latlng: { lat: number; lng: number }) => void;
  currentLocation?: { lat: number; lng: number };
}

export function PointEditingPanel({
  pointType,
  onClose,
  onSelect,
  currentLocation,
}: PointEditingPanelProps) {
  const { query, results, isLoading, history, search, selectResult, selectHistoryItem, clearSearch } = useSearch();

  const handleSelectResult = (result: SearchResult) => {
    const latlng = searchResultToLatLng(result);
    selectResult(result);
    onSelect(latlng);
  };

  const handleSelectHistory = (item: typeof history[0]) => {
    if (item.result) {
      onSelect({ lat: item.result.lat, lng: item.result.lng });
    } else {
      selectHistoryItem(item);
    }
  };

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
    {
      id: 'home',
      label: 'Дом',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      id: 'work',
      label: 'Работа',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
    },
  ];

  const handleQuickAction = (action: QuickAction) => {
    if (action.id === 'my-location' && currentLocation) {
      onSelect(currentLocation);
    } else if (action.id === 'favorites') {
      // TODO: Открыть избранное
    } else if (action.id === 'home') {
      // TODO: Использовать сохранённый адрес дома
    } else if (action.id === 'work') {
      // TODO: Использовать сохранённый адрес работы
    }
  };

  return (
    <BottomPanel className="point-editing-panel" onClose={onClose}>
      <div className="point-editing-header">
        <h3 className="point-editing-title">
          {pointType === 'start' ? 'Изменить начальную точку' : 'Изменить конечную точку'}
        </h3>
      </div>
      <div className="point-editing-content">
        <SearchBar
          value={query}
          onSearch={search}
          placeholder="Найти адрес или место"
        />
        {query ? (
          <SearchResults
            results={results}
            isLoading={isLoading}
            onSelect={handleSelectResult}
          />
        ) : (
          <>
            <QuickActions actions={quickActions} onSelect={handleQuickAction} />
            {history.length > 0 && (
              <SearchHistory history={history} onSelect={handleSelectHistory} />
            )}
          </>
        )}
      </div>
    </BottomPanel>
  );
}

