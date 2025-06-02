import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Context Providers
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { EquipmentProvider } from './contexts/EquipmentContext';
import { RentalsProvider } from './contexts/RentalsContext';
import { MaintenanceProvider } from './contexts/MaintenanceContext';
import { CustomThemeProvider } from './contexts/ThemeContext';

// Components
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Authentication/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EquipmentPage from './pages/EquipmentPage';
import EquipmentDetailPage from './pages/EquipmentDetailPage';
import RentalsPage from './pages/RentalsPage';
import MaintenancePage from './pages/MaintenancePage';

// Utils
import { USER_ROLES } from './utils/constants';
import { LOCAL_STORAGE_KEYS, MOCK_DATA } from './utils/constants';

// Main App Component
const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  // Add initialization check
  React.useEffect(() => {
    const existingUsers = localStorage.getItem(LOCAL_STORAGE_KEYS.USERS);
    if (!existingUsers) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(MOCK_DATA.users));
      localStorage.setItem(LOCAL_STORAGE_KEYS.EQUIPMENT, JSON.stringify(MOCK_DATA.equipment));
      localStorage.setItem(LOCAL_STORAGE_KEYS.RENTALS, JSON.stringify(MOCK_DATA.rentals));
      localStorage.setItem(LOCAL_STORAGE_KEYS.MAINTENANCE, JSON.stringify(MOCK_DATA.maintenance));
      localStorage.setItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(MOCK_DATA.notifications));
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a proper loading component
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
        } 
      />
      
      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/equipment" 
        element={
          <ProtectedRoute>
            <Layout>
              <EquipmentPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/equipment/:id" 
        element={
          <ProtectedRoute>
            <Layout>
              <EquipmentDetailPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/rentals" 
        element={
          <ProtectedRoute>
            <Layout>
              <RentalsPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/maintenance" 
        element={
          <ProtectedRoute requiredRoles={[USER_ROLES.ADMIN, USER_ROLES.STAFF]}>
            <Layout>
              <MaintenancePage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      {/* Default redirect */}
      <Route 
        path="/" 
        element={
          <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
        } 
      />
      
      {/* 404 fallback */}
      <Route 
        path="*" 
        element={
          <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
        } 
      />
    </Routes>
  );
};

const isDev = process.env.NODE_ENV === 'development';

const ResetDemoDataButton = () => {
  const navigate = useNavigate();
  const handleReset = () => {
    localStorage.clear();
    window.location.href = '/login';
  };
  if (!isDev) return null;
  return (
    <button
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 9999,
        background: '#2563eb',
        color: '#fff',
        border: 'none',
        borderRadius: 8,
        padding: '12px 20px',
        fontWeight: 600,
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
      }}
      onClick={handleReset}
    >
      Reset Demo Data
    </button>
  );
};

// Root App Component
function App() {
  return (
    <CustomThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <EquipmentProvider>
            <RentalsProvider>
              <MaintenanceProvider>
                <AppContent />
                <ResetDemoDataButton />
              </MaintenanceProvider>
            </RentalsProvider>
          </EquipmentProvider>
        </NotificationProvider>
      </AuthProvider>
    </CustomThemeProvider>
  );
}

export default App;
