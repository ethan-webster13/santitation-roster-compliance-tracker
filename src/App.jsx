import { createBrowserRouter,  RouterProvider, Outlet } from 'react-router-dom';
import { AuthProvider, ProtectedRoute, PublicRoute } from './Components/AuthContext'
import Home from './Pages/Home';
import RouteErrorPage from './Components/RouteErrorPage';
import Scheduler from './Pages/Scheduler';
import { Login } from './Pages/Login';
import Roster from './Pages/Roster';
import Compliance from './Pages/Compliance';
import NewEmp from './Pages/NewEmp';
import './css/App.css';
import AdminPage from './Pages/AdminPage'


const RootLayout = () => <Outlet />;

const PageNotFound = () => {
  return <h2>404 Page Not Found. Whoops! We can't find the page you're looking for.</h2> 
};

const Unauthorized = () => (
  <div style={{ padding: "2rem", textAlign: "center" }}>
    <h2>Access denied</h2>
    <p>You don't have permission to view this page.</p>
  </div>
);


const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <ProtectedRoute><Home /></ProtectedRoute> },
      { path: "home", element: <ProtectedRoute><Home /></ProtectedRoute> },
      { path: "login", element: <PublicRoute><Login /></PublicRoute> },
      { path: "admin", element: <ProtectedRoute allowedRoles={["manager"]}><AdminPage /></ProtectedRoute> },
      { path: "addnewemp", element: <ProtectedRoute allowedRoles={["manager"]}><NewEmp /></ProtectedRoute> },
      { path: "roster", element: <ProtectedRoute allowedRoles={["manager", "supervisor"]}><Roster /></ProtectedRoute> },
      { path: "compliance", element: <ProtectedRoute allowedRoles={["manager", "supervisor"]}><Compliance /></ProtectedRoute> },
      { path: "scheduler", element: <ProtectedRoute allowedRoles={["manager", "supervisor"]}><Scheduler /></ProtectedRoute> },
      { path: "unauthorized", element: <Unauthorized /> },
      { path: "*", element: <PageNotFound /> },
    ]
  }
]);

function App() {

  
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App
