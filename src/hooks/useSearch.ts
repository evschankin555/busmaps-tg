import { useState, useCallback, useEffect, useRef } from 'react';
import { searchAddress, SearchResult } from '../services/nominatim';
import { getSearchHistory, addToSearchHistory, SearchHistoryItem } from '../utils/storage';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setHistory(getSearchHistory());
  }, []);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = await searchAddress(searchQuery);
      setResults(searchResults);
    } catch (error) {
      console.error('Ошибка поиска:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const search = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
    
    // Очищаем предыдущий таймер
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Устанавливаем новый таймер для debounce
    debounceTimer.current = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);
  }, [performSearch]);

  const selectResult = useCallback((result: SearchResult) => {
    addToSearchHistory({
      query: result.display_name,
      result: {
        display_name: result.display_name,
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
      },
    });
    setHistory(getSearchHistory());
    setQuery('');
    setResults([]);
  }, []);

  const selectHistoryItem = useCallback((item: SearchHistoryItem) => {
    if (item.result) {
      setQuery(item.query);
      performSearch(item.query);
    }
  }, [performSearch]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
  }, []);

  return {
    query,
    results,
    isLoading,
    history,
    search,
    selectResult,
    selectHistoryItem,
    clearSearch,
  };
}

