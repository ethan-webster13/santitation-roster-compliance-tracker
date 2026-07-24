import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RosterProvider } from './context/RosterContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import './css/main.css'
import App from './App.jsx'
import Roster from './Pages/Roster.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <RosterProvider>
        <App />
      </RosterProvider>
    </ThemeProvider>
  </StrictMode>,
)
