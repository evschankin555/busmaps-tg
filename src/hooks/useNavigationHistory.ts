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
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/d8649f15-856d-44e5-9b57-dcabb0f6a1ef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useNavigationHistory.ts:26',message:'pushState called',data:{newView,newState,currentView:currentState.currentView,historyLength:history.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    try {
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
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/d8649f15-856d-44e5-9b57-dcabb0f6a1ef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useNavigationHistory.ts:52',message:'pushState completed',data:{newView},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/d8649f15-856d-44e5-9b57-dcabb0f6a1ef',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useNavigationHistory.ts:55',message:'pushState error',data:{error:error instanceof Error?error.message:String(error),newView},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      console.error('Ошибка в pushState:', error);
    }
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

