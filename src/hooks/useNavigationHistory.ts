import { useState, useCallback, useEffect } from 'react';
import { AppViewState, AppState, NavigationHistoryEntry } from '../state/AppState';

export function useNavigationHistory(initialState: AppState) {
  const [history, setHistory] = useState<NavigationHistoryEntry[]>([]);
  const [currentState, setCurrentState] = useState<AppState>(initialState);

  // Обработка browser back button
  useEffect(() => {
    const handlePopState = () => {
      if (history.length > 0) {
        const previousEntry = history[history.length - 1];
        setHistory(prev => prev.slice(0, -1));
        setCurrentState(prev => ({
          ...prev,
          ...previousEntry.state,
          currentView: previousEntry.view,
        }));
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [history]);

  const pushState = useCallback((newView: AppViewState, newState: Partial<AppState>) => {
    // Сохраняем текущее состояние в историю
    const entry: NavigationHistoryEntry = {
      view: currentState.currentView,
      state: {
        selectedPoint: currentState.selectedPoint,
        route: currentState.route,
        editingPointType: currentState.editingPointType,
        searchQuery: currentState.searchQuery,
        startPoint: currentState.startPoint,
        endPoint: currentState.endPoint,
      },
      timestamp: Date.now(),
    };

    setHistory(prev => [...prev, entry]);
    
    // Обновляем текущее состояние
    setCurrentState(prev => ({
      ...prev,
      currentView: newView,
      ...newState,
    }));

    // Обновляем browser history
    window.history.pushState({ view: newView, state: newState }, '', window.location.href);
  }, [currentState]);

  const popState = useCallback(() => {
    if (history.length > 0) {
      const previousEntry = history[history.length - 1];
      setHistory(prev => prev.slice(0, -1));
      setCurrentState(prev => ({
        ...prev,
        ...previousEntry.state,
        currentView: previousEntry.view,
      }));
      return true; // Успешно вернулись назад
    }
    return false; // Нет истории для возврата
  }, [history]);

  const replaceState = useCallback((newView: AppViewState, newState: Partial<AppState>) => {
    // Заменяем текущее состояние без добавления в историю
    setCurrentState(prev => ({
      ...prev,
      currentView: newView,
      ...newState,
    }));
    window.history.replaceState({ view: newView, state: newState }, '', window.location.href);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const canGoBack = history.length > 0;

  return {
    currentState,
    pushState,
    popState,
    replaceState,
    clearHistory,
    canGoBack,
    setCurrentState,
  };
}

