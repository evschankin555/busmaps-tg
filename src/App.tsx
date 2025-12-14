import { useEffect } from 'react'
import { init } from '@twa-dev/sdk'
import './App.css'

function App() {
  useEffect(() => {
    // Инициализация Telegram WebApp SDK
    init()
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <h1>BusMaps</h1>
        <p>Построение маршрутов</p>
      </header>
      <main className="app-main">
        <p>Приложение в разработке...</p>
      </main>
    </div>
  )
}

export default App
