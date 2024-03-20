import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import GameProvider from './providers/GameProvider.tsx';
import './index.css'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GameProvider>
      <DndProvider backend={HTML5Backend}>
        <App />
      </DndProvider>
    </GameProvider>
  </React.StrictMode>,
)
