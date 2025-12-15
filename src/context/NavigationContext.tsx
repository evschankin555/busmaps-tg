import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AppViewState, AppState } from '../state/AppState';
import { useNavigationHistory } from '../hooks/useNavigationHistory';
import '../types/telegram';

interface NavigationContextType {
  currentState: AppState;
  navigate: (view: AppViewState, state?: Partial<AppState>) => void;
  goBack: () => boolean;
  canGoBack: boolean;
  updateState: (updates: Partial<AppState>) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

const initialState: AppState = {
  currentView: AppViewState.HOME,
};

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const {
    currentState,
    pushState,
    popState,
    replaceState,
    canGoBack,
    setCurrentState,
  } = useNavigationHistory(initialState);

  // Интеграция с Telegram BackButton
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg && tg.BackButton) {
      // Проверяем версию - BackButton поддерживается с версии 6.1+
      const version = parseFloat(tg.version || '0');
      const isBackButtonSupported = version >= 6.1;
      
      if (isBackButtonSupported && typeof tg.BackButton.show === 'function' && typeof tg.BackButton.hide === 'function') {
        if (canGoBack) {
          tg.BackButton.show();
        } else {
          tg.BackButton.hide();
        }

        const handleBackButton = () => {
          if (!popState()) {
            // Если не можем вернуться назад, закрываем приложение
            tg.close();
          }
        };

        tg.BackButton.onClick(handleBackButton);
        return () => {
          tg.BackButton.offClick(handleBackButton);
        };
      }
    }
  }, [canGoBack, popState]);

  const navigate = useCallback((view: AppViewState, state?: Partial<AppState>) => {
    pushState(view, state || {});
  }, [pushState]);

  const goBack = useCallback(() => {
    return popState();
  }, [popState]);

  const updateState = useCallback((updates: Partial<AppState>) => {
    setCurrentState(prev => ({ ...prev, ...updates }));
  }, [setCurrentState]);

  return (
    <NavigationContext.Provider
      value={{
        currentState,
        navigate,
        goBack,
        canGoBack,
        updateState,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}

