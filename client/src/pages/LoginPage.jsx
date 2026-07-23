import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Car, LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../utils/constants';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || ROUTES.HOME;

  const [showPassword, setShowPassword] = useState(false);
  const [serverError,  setServerError]  = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onTouched' });

  const onSubmit = async (data) => {
    setServerError('');
    const result = await login(data);
    if (result.ok) {
      navigate(from, { replace: true });
    } else {
      setServerError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-4">
      {/* Ambient glow blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Card */}
        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-8">

          {/* Logo + heading */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
              <Car className="w-7 h-7 text-white" strokeWidth={1.8} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back</h1>
            <p className="text-slate-400 text-sm mt-1">Sign in to your dealership account</p>
          </div>

          {/* Server-level error banner */}
          {serverError && (
            <div
              id="login-server-error"
              role="alert"
              className="mb-5 flex items-start gap-2 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm"
            >
              <span className="font-medium">{serverError}</span>
            </div>
          )}

          <form id="login-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="text-sm font-medium text-slate-300">
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className={`w-full px-4 py-3 rounded-xl bg-slate-900/70 border text-white placeholder-slate-500
                  text-sm transition-all duration-200 outline-none
                  focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500
                  ${errors.email ? 'border-red-500/70 bg-red-500/5' : 'border-slate-600/60 hover:border-slate-500'}`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email address',
                  },
                })}
              />
              {errors.email && (
                <p id="login-email-error" role="alert" className="text-xs text-red-400 mt-1 flex items-center gap-1">
                  <span>⚠</span> {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="login-password" className="text-sm font-medium text-slate-300">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 pr-12 rounded-xl bg-slate-900/70 border text-white placeholder-slate-500
                    text-sm transition-all duration-200 outline-none
                    focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500
                    ${errors.password ? 'border-red-500/70 bg-red-500/5' : 'border-slate-600/60 hover:border-slate-500'}`}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  })}
                />
                <button
                  id="login-toggle-password"
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p id="login-password-error" role="alert" className="text-xs text-red-400 mt-1 flex items-center gap-1">
                  <span>⚠</span> {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 mt-2
                bg-gradient-to-r from-indigo-600 to-purple-600
                hover:from-indigo-500 hover:to-purple-500
                disabled:from-indigo-800 disabled:to-purple-800 disabled:cursor-not-allowed
                text-white font-semibold text-sm rounded-xl
                shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40
                transition-all duration-200 active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign in
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700/60" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-slate-800/60 text-slate-500">Don't have an account?</span>
            </div>
          </div>

          {/* Register link */}
          <Link
            id="login-register-link"
            to={ROUTES.REGISTER}
            className="w-full flex items-center justify-center py-2.5 px-4
              border border-slate-600/60 hover:border-indigo-500/60
              text-slate-300 hover:text-indigo-400
              text-sm font-medium rounded-xl
              transition-all duration-200 hover:bg-indigo-500/5"
          >
            Create an account
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-600 text-xs mt-6">
          Car Dealership Inventory © {new Date().getFullYear()}
        </p>
      </div>

      {/* Fade-in animation */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.4s ease-out both; }
      `}</style>
    </div>
  );
}
