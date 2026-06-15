import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, ProtectedRoute, PublicRoute } from './Components/AuthContext'
import Home from './Pages/Home'
import Scheduler from './Pages/Scheduler'
import { Login } from './Pages/Login'
import Roster from './Pages/Roster'
import Compliance from './Pages/Compliance'
import NewUser from './Pages/NewUser'
import './App.css'
import AdminPage from './Pages/AdminPage'



function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path='/login' element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><NewUser /></PublicRoute>} />

          <Route path='/admin' element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <AdminPage />
            </ProtectedRoute>
          } /> 

          <Route path='/' element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>} />
          <Route path='/home' element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>} />
          <Route path='/roster' element={
            <ProtectedRoute allowedRoles={["manager", "supervisor"]} >
              <Roster />
            </ProtectedRoute>} />
          <Route path='/compliance' element={
            <ProtectedRoute allowedRoles={["manager", "supervisor"]}>
              <Compliance />
            </ProtectedRoute>} />
          <Route path='/scheduler' element={
            <ProtectedRoute allowedRoles={["manager", "supervisor"]}>
              <Scheduler />
            </ProtectedRoute>} />
          
          <Route path='/unauthorized' element={<Unauthorized />} />
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

const PageNotFound = () => {
  return <h2>404 Page Not Found. Whoops! We can't find the page you're looking for.</h2> 
};

const Unauthorized = () => (
  <div style={{ padding: "2rem", textAlign: "center" }}>
    <h2>Access denied</h2>
    <p>You don't have permission to view this page.</p>
  </div>
);
export default App
