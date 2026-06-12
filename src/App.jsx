import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './Components/AuthContext'
import Home from './Pages/Home'
import Scheduler from './Pages/Scheduler'
import { Login } from './pages/Login'
import Roster from './Pages/Roster'
import Compliance from './Pages/Compliance'
import NewUser from './Pages/NewUser'
import './App.css'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/home" replace />
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path='/login' element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><NewUser /></PublicRoute>} /> 

          <Route path='/' element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path='/home' element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path='/roster' element={<ProtectedRoute><Roster /></ProtectedRoute>} />
          <Route path='/compliance' element={<ProtectedRoute><Compliance /></ProtectedRoute>} />
          <Route path='/scheduler' element={<ProtectedRoute><Scheduler /></ProtectedRoute>} />
          
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

const PageNotFound = () => {
  return <h2>404 Page Not Found. Whoops! We can't find the page you're looking for.</h2> 
}

export default App
