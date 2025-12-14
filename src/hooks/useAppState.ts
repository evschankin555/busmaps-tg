import { useCallback } from 'react';
import { AppViewState } from '../state/AppState';
import { useNavigation } from '../context/NavigationContext';
import { LatLng } from '../types/route';

export function useAppState() {
  const { currentState, navigate, goBack, canGoBack, updateState } = useNavigation();

  const goToHome = useCallback(() => {
    navigate(AppViewState.HOME);
  }, [navigate]);

  const goToPointSelection = useCallback((point?: LatLng) => {
    navigate(AppViewState.POINT_SELECTION, { selectedPoint: point });
  }, [navigate]);

  const goToRoutePlanning = useCallback((start: LatLng, end: LatLng) => {
    navigate(AppViewState.ROUTE_PLANNING, { startPoint: start, endPoint: end });
  }, [navigate]);

  const goToPointEditing = useCallback((pointType: 'start' | 'end') => {
    navigate(AppViewState.POINT_EDITING, { editingPointType: pointType });
  }, [navigate]);

  const goToNavigation = useCallback(() => {
    if (currentState.route) {
      navigate(AppViewState.NAVIGATION);
    }
  }, [navigate, currentState.route]);

  const goToSearch = useCallback((query?: string) => {
    navigate(AppViewState.SEARCH, { searchQuery: query });
  }, [navigate]);

  const handleBack = useCallback(() => {
    return goBack();
  }, [goBack]);

  return {
    currentState,
    goToHome,
    goToPointSelection,
    goToRoutePlanning,
    goToPointEditing,
    goToNavigation,
    goToSearch,
    handleBack,
    canGoBack,
    updateState,
  };
}

