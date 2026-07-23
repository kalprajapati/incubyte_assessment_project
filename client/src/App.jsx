import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { ROLES, ROUTES } from './utils/constants';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import SearchPage from './pages/SearchPage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';

/**
 * PublicOnlyRoute — redirects already-authenticated users away
 * from /login and /register to the home dashboard.
 */
function PublicOnlyRoute({ children }) {
  const { user, hydrating } = useAuth();

  if (hydrating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return user ? <Navigate to={ROUTES.HOME} replace /> : children;
}

export default function App() {
  return (
    <Routes>
      {/* Public-only routes (redirect if already logged in) */}
      <Route
        path={ROUTES.LOGIN}
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path={ROUTES.REGISTER}
        element={
          <PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>
        }
      />

      {/* Protected routes */}
      <Route
        path={ROUTES.HOME}
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.VEHICLES}
        element={
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ADMIN}
        element={
          <ProtectedRoute roles={[ROLES.ADMIN]}>
            <AdminPage />
          </ProtectedRoute>
        }
      />

      {/* Catch-all — redirect to login */}
      <Route path={ROUTES.NOT_FOUND} element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  );
}
