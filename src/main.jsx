import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RosterProvider } from './context/RosterContext.jsx'
import './index.css'
import App from './App.jsx'
import Roster from './Pages/Roster.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RosterProvider>
      <App />
    </RosterProvider>
  </StrictMode>,
)
