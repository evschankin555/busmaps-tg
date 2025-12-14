# BusMaps - Документация для AI агентов

## Обзор проекта

**BusMaps** - клиентское Telegram Mini App для построения маршрутов. Приложение работает полностью на фронтенде, использует бесплатные API (OSRM, Nominatim, OpenStreetMap) и хранит данные пользователей в Telegram Cloud Storage.

## Архитектура

### Клиентское приложение
- **Тип**: SPA (Single Page Application)
- **Платформа**: Telegram Mini App (WebView)
- **Backend**: Отсутствует (чистый клиент)
- **Хранение данных**: Telegram Cloud Storage API

### Технологический стек

#### Основные зависимости
```json
{
  "react": "^18.2.0",           // UI библиотека
  "react-dom": "^18.2.0",      // React для DOM
  "typescript": "^5.2.2",       // Типизация
  "vite": "^5.0.8",            // Сборщик и dev-сервер
  "leaflet": "^1.9.4",          // Карты
  "react-leaflet": "^4.2.1",   // React обертка для Leaflet
  "@twa-dev/sdk": "^1.0.0",    // Telegram WebApp SDK
  "axios": "^1.6.0"            // HTTP клиент
}
```

#### Dev зависимости
```json
{
  "@types/react": "^18.2.43",
  "@types/react-dom": "^18.2.17",
  "@types/leaflet": "^1.9.8",
  "@vitejs/plugin-react": "^4.2.1",
  "eslint": "^8.55.0",
  "typescript": "^5.2.2"
}
```

## Структура проекта

```
busmaps-tg/
├── src/
│   ├── components/           # React компоненты
│   │   ├── Map/              # Компонент карты Leaflet
│   │   │   ├── Map.tsx       # Основной компонент карты
│   │   │   ├── MapMarker.tsx # Маркеры точек
│   │   │   └── MapRoute.tsx  # Отображение маршрута
│   │   ├── RoutePlanner/     # Планировщик маршрутов
│   │   │   ├── RoutePlanner.tsx
│   │   │   ├── PointSelector.tsx
│   │   │   └── RouteInfo.tsx
│   │   ├── SearchBar/        # Поиск адресов
│   │   │   └── SearchBar.tsx
│   │   └── UI/               # Переиспользуемые UI компоненты
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       └── Loading.tsx
│   ├── hooks/                # Custom React hooks
│   │   ├── useTelegram.ts    # Работа с Telegram WebApp API
│   │   ├── useRouting.ts     # Логика построения маршрутов
│   │   ├── useMap.ts         # Управление состоянием карты
│   │   └── useGeocoding.ts   # Геокодирование адресов
│   ├── services/             # Сервисы для работы с внешними API
│   │   ├── osrm.ts           # OSRM API клиент
│   │   ├── nominatim.ts      # Nominatim геокодирование
│   │   └── telegram.ts       # Telegram Cloud Storage
│   ├── types/                # TypeScript типы и интерфейсы
│   │   ├── route.ts          # Типы для маршрутов
│   │   ├── map.ts            # Типы для карты
│   │   ├── telegram.ts       # Типы Telegram API
│   │   └── api.ts            # Типы API ответов
│   ├── utils/                # Утилиты
│   │   ├── format.ts         # Форматирование данных
│   │   ├── storage.ts        # Работа с хранилищем
│   │   └── constants.ts     # Константы
│   ├── App.tsx               # Главный компонент приложения
│   ├── main.tsx              # Точка входа
│   └── index.css             # Глобальные стили
├── public/                   # Статические файлы
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── plan.md                   # План разработки
└── agents.md                 # Этот файл
```

## Стиль кода

### TypeScript

#### Общие правила
- **Строгая типизация**: Все функции и компоненты должны иметь типы
- **Интерфейсы вместо типов**: Для объектов используем `interface`
- **Типы для пропсов**: Всегда типизируем props компонентов
- **Избегаем `any`**: Используем `unknown` или конкретные типы

#### Примеры

```typescript
// ✅ Хорошо
interface RoutePoint {
  lat: number
  lng: number
  name?: string
}

interface RoutePlannerProps {
  onRouteCalculate: (route: Route) => void
  initialPoints?: RoutePoint[]
}

// ❌ Плохо
const RoutePlanner = (props: any) => { ... }
```

#### Именование
- **Компоненты**: PascalCase (`RoutePlanner`, `MapMarker`)
- **Функции/переменные**: camelCase (`calculateRoute`, `routePoints`)
- **Константы**: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_ROUTE_POINTS`)
- **Типы/Интерфейсы**: PascalCase (`Route`, `MapConfig`)

### React

#### Компоненты
- **Функциональные компоненты**: Используем только функциональные компоненты с hooks
- **Props деструктуризация**: Деструктурируем props в параметрах
- **Мемоизация**: Используем `useMemo` и `useCallback` для оптимизации
- **Custom hooks**: Выносим логику в custom hooks

#### Примеры

```typescript
// ✅ Хорошо
interface MapProps {
  center: [number, number]
  zoom: number
  onPointSelect: (point: RoutePoint) => void
}

const Map: React.FC<MapProps> = ({ center, zoom, onPointSelect }) => {
  const handleMapClick = useCallback((e: LeafletMouseEvent) => {
    onPointSelect({ lat: e.latlng.lat, lng: e.latlng.lng })
  }, [onPointSelect])

  return (
    <MapContainer center={center} zoom={zoom}>
      {/* ... */}
    </MapContainer>
  )
}

// ❌ Плохо
const Map = (props) => {
  return <div>{props.center}</div>
}
```

#### Hooks правила
- **Порядок hooks**: Всегда в одном порядке
- **Условные hooks**: Никогда не используем условно
- **Зависимости**: Всегда указываем правильные зависимости в массивах зависимостей

### Стилизация

#### Подход
- **CSS Modules** или **Inline styles** для компонентов
- **Глобальные стили** только в `index.css`
- **Адаптивность**: Mobile-first подход
- **Telegram тема**: Используем цвета из Telegram WebApp API

#### Примеры

```typescript
// ✅ Хорошо - CSS Modules
import styles from './Map.module.css'

const Map = () => {
  return <div className={styles.mapContainer}>...</div>
}

// ✅ Хорошо - Inline styles для динамических значений
const Marker = ({ color }) => {
  return <div style={{ backgroundColor: color }}>...</div>
}
```

### API и сервисы

#### Структура сервисов
- **Один сервис = один API**: Каждый сервис отвечает за один внешний API
- **Типизация ответов**: Все ответы API должны быть типизированы
- **Обработка ошибок**: Всегда обрабатываем ошибки
- **Кеширование**: Кешируем часто используемые данные

#### Примеры

```typescript
// ✅ Хорошо
interface OSRMRouteResponse {
  code: string
  routes: Array<{
    distance: number
    duration: number
    geometry: string
  }>
}

class OSRMService {
  private static readonly BASE_URL = 'https://router.project-osrm.org'
  private static cache = new Map<string, OSRMRouteResponse>()

  static async getRoute(
    from: RoutePoint,
    to: RoutePoint
  ): Promise<OSRMRouteResponse> {
    const cacheKey = `${from.lat},${from.lng}-${to.lat},${to.lng}`
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!
    }

    try {
      const response = await axios.get<OSRMRouteResponse>(
        `${this.BASE_URL}/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}`
      )
      this.cache.set(cacheKey, response.data)
      return response.data
    } catch (error) {
      throw new Error(`Failed to get route: ${error}`)
    }
  }
}

// ❌ Плохо
const getRoute = async (from: any, to: any) => {
  const res = await fetch('...')
  return res.json()
}
```

### Хранение данных

#### Telegram Cloud Storage
- **Ключи**: Используем понятные ключи (`route_${id}`, `favorites`, `history`)
- **Лимиты**: Учитываем лимиты Telegram (до 1MB на пользователя)
- **Обработка ошибок**: Обрабатываем ошибки записи/чтения

#### Примеры

```typescript
// ✅ Хорошо
class TelegramStorage {
  static async saveRoute(routeId: string, route: Route): Promise<void> {
    try {
      await window.Telegram.WebApp.CloudStorage.setItem(
        `route_${routeId}`,
        JSON.stringify(route)
      )
    } catch (error) {
      console.error('Failed to save route:', error)
      throw error
    }
  }

  static async getRoute(routeId: string): Promise<Route | null> {
    try {
      const data = await window.Telegram.WebApp.CloudStorage.getItem(
        `route_${routeId}`
      )
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Failed to get route:', error)
      return null
    }
  }
}
```

## Зависимости и их использование

### React & React DOM
- **Назначение**: UI библиотека
- **Использование**: Все компоненты, hooks, состояние

### TypeScript
- **Назначение**: Типизация
- **Использование**: Все файлы `.ts` и `.tsx`

### Vite
- **Назначение**: Сборщик и dev-сервер
- **Использование**: `npm run dev`, `npm run build`
- **Конфигурация**: `vite.config.ts`

### Leaflet & React-Leaflet
- **Назначение**: Карты
- **Использование**: Компоненты `Map`, `MapContainer`, `TileLayer`, `Marker`, `Polyline`
- **Важно**: Не забывать импортировать CSS Leaflet

### Telegram WebApp SDK
- **Назначение**: Интеграция с Telegram
- **Использование**: 
  - `init()` - инициализация
  - `window.Telegram.WebApp` - доступ к API
  - `CloudStorage` - хранение данных

### Axios
- **Назначение**: HTTP запросы
- **Использование**: Все запросы к внешним API (OSRM, Nominatim)

## Внешние API

### OSRM (Open Source Routing Machine)
- **URL**: `https://router.project-osrm.org/route/v1`
- **Метод**: GET
- **Параметры**: 
  - `profile`: `driving`, `walking`, `cycling`
  - Координаты: `{lng},{lat};{lng},{lat}`
- **Ответ**: JSON с маршрутом (geometry, distance, duration)
- **Лимиты**: Публичный сервер имеет ограничения, рекомендуется свой сервер для продакшена

### Nominatim (Geocoding)
- **URL**: `https://nominatim.openstreetmap.org/`
- **Методы**: 
  - `search` - поиск адресов
  - `reverse` - обратное геокодирование
- **Лимиты**: 1 запрос в секунду (нужен User-Agent)
- **Важно**: Соблюдать правила использования

### OpenStreetMap Tiles
- **URL**: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
- **Использование**: Через Leaflet `TileLayer`
- **Лимиты**: Соблюдать правила использования, рекомендуется использовать свой тайл-сервер для продакшена

## Правила разработки

### Коммиты
- **Формат**: `type(scope): description`
- **Типы**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- **Примеры**:
  - `feat(map): add route display`
  - `fix(routing): handle API errors`
  - `docs: update plan.md`

### Тестирование
- **Unit тесты**: Для утилит и сервисов
- **Component тесты**: Для критичных компонентов
- **E2E тесты**: Для основных сценариев (опционально)

### Производительность
- **Code splitting**: Разделение кода на чанки
- **Lazy loading**: Ленивая загрузка компонентов
- **Мемоизация**: Использование `useMemo`, `useCallback`
- **Оптимизация карт**: Ограничение количества маркеров

### Безопасность
- **Валидация данных**: Всегда валидируем данные от API
- **XSS защита**: Не используем `dangerouslySetInnerHTML`
- **CORS**: Учитываем ограничения CORS для API

## Частые задачи

### Добавление нового компонента
1. Создать файл в `src/components/`
2. Типизировать props через `interface`
3. Добавить стили (CSS Module или inline)
4. Экспортировать из `index.ts` (если есть)

### Добавление нового API сервиса
1. Создать файл в `src/services/`
2. Определить типы ответов в `src/types/api.ts`
3. Реализовать методы с обработкой ошибок
4. Добавить кеширование (если нужно)

### Работа с Telegram API
1. Использовать `useTelegram` hook
2. Проверять доступность `window.Telegram`
3. Обрабатывать ошибки
4. Использовать Cloud Storage для данных пользователя

## Полезные команды

```bash
# Установка зависимостей
npm install

# Запуск dev-сервера
npm run dev

# Сборка для продакшена
npm run build

# Проверка типов
npm run type-check

# Линтинг
npm run lint

# Предпросмотр сборки
npm run preview
```

## Контакты и ресурсы

- **Документация Leaflet**: https://leafletjs.com/
- **React-Leaflet**: https://react-leaflet.js.org/
- **Telegram Mini Apps**: https://core.telegram.org/bots/webapps
- **OSRM API**: http://project-osrm.org/docs/v5.24.0/api/
- **Nominatim API**: https://nominatim.org/release-docs/develop/api/Overview/
