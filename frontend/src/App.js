import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useTheme } from './context/ThemeContext';
import { getAuthToken, getAuthUser, getDashboardPath } from './utils/auth';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import CustomerDashboard from './pages/CustomerDashboard';
import VendorDashboard from './pages/VendorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

const PublicRoute = ({ children }) => {
  const token = getAuthToken();
  const user = getAuthUser();

  if (token && user?.role) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return children;
};

const PrivateRoute = ({ children, role }) => {
  const token = getAuthToken();
  const user = getAuthUser();

  if (!token || !user) return <Navigate to="/" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return children;
};

const AppContent = () => {
  const { isDarkMode } = useTheme();

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          className: '',
          style: {
            background: isDarkMode ? '#0f172a' : '#ffffff',
            color: isDarkMode ? '#f8fafc' : '#0f172a',
            border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0',
            padding: '16px',
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            fontSize: '13px',
            fontWeight: '600',
            maxWidth: '400px',
          },
          success: {
            iconTheme: {
              primary: '#3b82f6',
              secondary: isDarkMode ? '#0f172a' : '#ffffff',
            },
            style: {
              background: isDarkMode ? '#0f172a' : '#ffffff',
            }
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: isDarkMode ? '#0f172a' : '#ffffff',
            },
            style: {
              background: isDarkMode ? '#0f172a' : '#ffffff',
            }
          },
        }}
      />
      <Routes>
        <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/customer"
          element={
            <PrivateRoute role="customer">
              <CustomerDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/vendor"
          element={
            <PrivateRoute role="vendor">
              <VendorDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;