import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../services/auth.service';
import { STORAGE_KEYS, ROUTES } from '../utils/constants';

// ─── Context ─────────────────────────────────────────────
const AuthContext = createContext(null);

// ─── Helpers ─────────────────────────────────────────────
const readStorage = () => {
  try {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const user  = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || 'null');
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
};

const writeStorage = (token, user) => {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

const clearStorage = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
};

// ─── Provider ────────────────────────────────────────────
export function AuthProvider({ children }) {
  const { token: savedToken, user: savedUser } = readStorage();

  const [user,    setUser]    = useState(savedUser);
  const [token,   setToken]   = useState(savedToken);
  const [loading, setLoading] = useState(false);
  // Hydrating = verifying the persisted token with the server on mount
  const [hydrating, setHydrating] = useState(!!savedToken);

  const navigate = useNavigate();

  // On mount: if a token is in storage, validate it with /auth/me
  useEffect(() => {
    if (!savedToken) { setHydrating(false); return; }

    authService.getMe()
      .then((freshUser) => {
        setUser(freshUser);
        writeStorage(savedToken, freshUser);
      })
      .catch(() => {
        // Token invalid / expired — clear everything
        clearStorage();
        setToken(null);
        setUser(null);
      })
      .finally(() => setHydrating(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── login ──────────────────────────────────────────────
  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const { token: newToken, user: newUser } = await authService.login(credentials);
      writeStorage(newToken, newUser);
      setToken(newToken);
      setUser(newUser);
      toast.success(`Welcome back, ${newUser.name}! 🎉`);
      return { ok: true };
    } catch (err) {
      const msg = err.friendlyMessage || 'Login failed. Please try again.';
      toast.error(msg);
      return { ok: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  // ── register ───────────────────────────────────────────
  const register = useCallback(async (data) => {
    setLoading(true);
    try {
      const { token: newToken, user: newUser } = await authService.register(data);
      writeStorage(newToken, newUser);
      setToken(newToken);
      setUser(newUser);
      toast.success(`Account created! Welcome, ${newUser.name} 🚗`);
      return { ok: true };
    } catch (err) {
      const msg = err.friendlyMessage || 'Registration failed. Please try again.';
      toast.error(msg);
      return { ok: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  // ── logout ─────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore server errors — clear client-side regardless
    } finally {
      clearStorage();
      setToken(null);
      setUser(null);
      toast.info('You have been logged out.');
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }, [navigate]);

  const isAuthenticated = Boolean(user && token);

  const value = { user, token, isAuthenticated, loading, hydrating, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
