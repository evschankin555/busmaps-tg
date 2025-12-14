import React from 'react';
import { SearchHistoryItem, clearSearchHistory } from '../../utils/storage';
import './SearchHistory.css';

interface SearchHistoryProps {
  history: SearchHistoryItem[];
  onSelect: (item: SearchHistoryItem) => void;
  onClear?: () => void;
  className?: string;
}

export function SearchHistory({ history, onSelect, onClear, className = '' }: SearchHistoryProps) {
  if (history.length === 0) {
    return null;
  }

  const handleClear = () => {
    clearSearchHistory();
    if (onClear) {
      onClear();
    }
  };

  return (
    <div className={`search-history ${className}`}>
      <div className="search-history-header">
        <h3 className="search-history-title">История поиска</h3>
        <button className="search-history-clear" onClick={handleClear}>
          Очистить
        </button>
      </div>
      <div className="search-history-list">
        {history.map((item, index) => (
          <button
            key={index}
            className="search-history-item"
            onClick={() => onSelect(item)}
          >
            <div className="search-history-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div className="search-history-content">
              <div className="search-history-query">{item.query}</div>
              {item.result && (
                <div className="search-history-result">{item.result.display_name}</div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

