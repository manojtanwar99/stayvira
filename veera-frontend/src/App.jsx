// App.js
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Listings from './pages/Listings';
// import Listings from './pages/Listings';
// import Analytics from './pages/Analytics';
// import Settings from './pages/Settings';
import { useAuthStore } from './store/authStore';
import Dashboard from './pages/Dashboard';
import UserProfile from './pages/User';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <>
      {children}
    </>
  );
};

// Public Route Component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function App() {
  return (
    <div className="App min-h-screen bg-gray-50">
      <Routes>
        {/* Public Route - Login */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />

        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard/>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/listings" 
          element={
            <ProtectedRoute>
               <Listings/>
              {/* <Listings /> */}
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/analytics" 
          element={
            <ProtectedRoute>
              <Dashboard/>
              {/* <Analytics /> */}
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
               <Dashboard/>
              {/* <Settings /> */}
            </ProtectedRoute>
          } 
        />

        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <UserProfile/>
              {/* <Settings /> */}
            </ProtectedRoute>
          }
        />
        {/* Redirect root to dashboard */}
        <Route 
          path="/" 
          element={<Navigate to="/dashboard" replace />} 
        />

        {/* 404 - Catch all */}
        <Route 
          path="*" 
          element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-800">404</h1>
                <p className="text-xl text-gray-600 mt-4">Page not found</p>
                <a href="/dashboard" className="text-blue-600 hover:underline mt-4 inline-block">
                  Go to Dashboard
                </a>
              </div>
            </div>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;