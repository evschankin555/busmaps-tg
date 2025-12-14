const SEARCH_HISTORY_KEY = 'busmaps_search_history';
const MAX_HISTORY_ITEMS = 20;

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
  result?: {
    display_name: string;
    lat: number;
    lng: number;
  };
}

export function getSearchHistory(): SearchHistoryItem[] {
  try {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (!stored) return [];
    const history = JSON.parse(stored) as SearchHistoryItem[];
    return history.sort((a, b) => b.timestamp - a.timestamp).slice(0, MAX_HISTORY_ITEMS);
  } catch {
    return [];
  }
}

export function addToSearchHistory(item: Omit<SearchHistoryItem, 'timestamp'>) {
  try {
    const history = getSearchHistory();
    // Удаляем дубликаты
    const filtered = history.filter(h => h.query !== item.query);
    const newHistory = [
      { ...item, timestamp: Date.now() },
      ...filtered,
    ].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error('Ошибка сохранения истории поиска:', error);
  }
}

export function clearSearchHistory() {
  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch (error) {
    console.error('Ошибка очистки истории поиска:', error);
  }
}

