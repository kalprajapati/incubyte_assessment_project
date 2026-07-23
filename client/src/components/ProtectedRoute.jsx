import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../utils/constants';

/**
 * ProtectedRoute
 *
 * Wraps routes that require authentication (and optionally specific roles).
 *
 * Props:
 *  - children   — the component to render when access is granted
 *  - roles      — optional array of allowed roles e.g. ['Admin']
 */
export default function ProtectedRoute({ children, roles }) {
  const { user, hydrating } = useAuth();
  const location = useLocation();

  // While verifying the persisted token with the server, show a spinner
  if (hydrating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Authenticating…</p>
        </div>
      </div>
    );
  }

  // Not logged in — redirect to /login, preserving intended destination
  if (!user) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // Role-based access check
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children;
}
