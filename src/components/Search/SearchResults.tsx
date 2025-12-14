import React from 'react';
import { SearchResult } from '../../services/nominatim';
import './SearchResults.css';

interface SearchResultsProps {
  results: SearchResult[];
  onSelect: (result: SearchResult) => void;
  isLoading?: boolean;
  className?: string;
}

export function SearchResults({ results, onSelect, isLoading, className = '' }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className={`search-results ${className}`}>
        <div className="search-results-loading">Поиск...</div>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className={`search-results ${className}`}>
      {results.map((result) => (
        <button
          key={result.place_id}
          className="search-result-item"
          onClick={() => onSelect(result)}
        >
          <div className="search-result-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div className="search-result-content">
            <div className="search-result-name">{result.display_name}</div>
            {result.address && (
              <div className="search-result-address">
                {[
                  result.address.road,
                  result.address.house_number,
                  result.address.city,
                ]
                  .filter(Boolean)
                  .join(', ')}
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}

