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
      // Проверяем, поддерживается ли BackButton (доступен с версии 6.1+)
      // Проверяем наличие методов show/hide
      if (typeof tg.BackButton.show === 'function' && typeof tg.BackButton.hide === 'function') {
        if (canGoBack) {
          try {
            tg.BackButton.show();
          } catch (error) {
            console.warn('BackButton.show() не поддерживается в этой версии Telegram WebApp');
          }
        } else {
          try {
            tg.BackButton.hide();
          } catch (error) {
            console.warn('BackButton.hide() не поддерживается в этой версии Telegram WebApp');
          }
        }

        const handleBackButton = () => {
          if (!popState()) {
            // Если не можем вернуться назад, закрываем приложение
            tg.close();
          }
        };

        try {
          tg.BackButton.onClick(handleBackButton);
          return () => {
            try {
              tg.BackButton.offClick(handleBackButton);
            } catch (error) {
              // Игнорируем ошибки при очистке
            }
          };
        } catch (error) {
          console.warn('BackButton.onClick() не поддерживается в этой версии Telegram WebApp');
        }
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

