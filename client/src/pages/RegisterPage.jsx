import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Car, UserPlus, ShieldCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ROUTES, ROLES } from '../utils/constants';

export default function RegisterPage() {
  const { register: registerUser, loading } = useAuth();
  const navigate = useNavigate();

  const [showPassword,        setShowPassword]        = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAdminSecret,     setShowAdminSecret]     = useState(false);
  const [serverError,         setServerError]         = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
    defaultValues: { role: ROLES.USER },
  });

  const watchedRole     = watch('role');
  const watchedPassword = watch('password');
  const isAdmin = watchedRole === ROLES.ADMIN;

  // Clear adminSecret when role switches back to User
  useEffect(() => {
    if (!isAdmin) setValue('adminSecret', '');
  }, [isAdmin, setValue]);

  const onSubmit = async (data) => {
    setServerError('');
    // Don't send confirmPassword to the API
    const { confirmPassword: _cp, ...payload } = data;
    if (!isAdmin) delete payload.adminSecret;

    const result = await registerUser(payload);
    if (result.ok) {
      navigate(ROUTES.HOME, { replace: true });
    } else {
      setServerError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-4 py-10">
      {/* Ambient glow blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Card */}
        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-8">

          {/* Logo + heading */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
              <Car className="w-7 h-7 text-white" strokeWidth={1.8} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Create account</h1>
            <p className="text-slate-400 text-sm mt-1">Join the Car Dealership platform</p>
          </div>

          {/* Server-level error banner */}
          {serverError && (
            <div
              id="register-server-error"
              role="alert"
              className="mb-5 flex items-start gap-2 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm"
            >
              <span className="font-medium">{serverError}</span>
            </div>
          )}

          <form id="register-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

            {/* Full name */}
            <div className="space-y-1.5">
              <label htmlFor="register-name" className="text-sm font-medium text-slate-300">
                Full name
              </label>
              <input
                id="register-name"
                type="text"
                autoComplete="name"
                placeholder="John Doe"
                className={`w-full px-4 py-3 rounded-xl bg-slate-900/70 border text-white placeholder-slate-500
                  text-sm transition-all duration-200 outline-none
                  focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500
                  ${errors.name ? 'border-red-500/70 bg-red-500/5' : 'border-slate-600/60 hover:border-slate-500'}`}
                {...register('name', {
                  required: 'Full name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' },
                  maxLength: { value: 60, message: 'Name must be 60 characters or less' },
                })}
              />
              {errors.name && (
                <p id="register-name-error" role="alert" className="text-xs text-red-400 flex items-center gap-1">
                  <span>⚠</span> {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="register-email" className="text-sm font-medium text-slate-300">
                Email address
              </label>
              <input
                id="register-email"
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
                <p id="register-email-error" role="alert" className="text-xs text-red-400 flex items-center gap-1">
                  <span>⚠</span> {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="register-password" className="text-sm font-medium text-slate-300">
                Password
              </label>
              <div className="relative">
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Min. 6 characters"
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
                  id="register-toggle-password"
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p id="register-password-error" role="alert" className="text-xs text-red-400 flex items-center gap-1">
                  <span>⚠</span> {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label htmlFor="register-confirm-password" className="text-sm font-medium text-slate-300">
                Confirm password
              </label>
              <div className="relative">
                <input
                  id="register-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  className={`w-full px-4 py-3 pr-12 rounded-xl bg-slate-900/70 border text-white placeholder-slate-500
                    text-sm transition-all duration-200 outline-none
                    focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500
                    ${errors.confirmPassword ? 'border-red-500/70 bg-red-500/5' : 'border-slate-600/60 hover:border-slate-500'}`}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (v) => v === watchedPassword || 'Passwords do not match',
                  })}
                />
                <button
                  id="register-toggle-confirm-password"
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p id="register-confirm-password-error" role="alert" className="text-xs text-red-400 flex items-center gap-1">
                  <span>⚠</span> {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Role Selector */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Account type</label>
              <div className="grid grid-cols-2 gap-3">
                {[ROLES.USER, ROLES.ADMIN].map((role) => (
                  <label
                    key={role}
                    htmlFor={`register-role-${role.toLowerCase()}`}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border cursor-pointer
                      text-sm font-medium transition-all duration-200
                      ${watchedRole === role
                        ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300'
                        : 'border-slate-600/60 bg-slate-900/40 text-slate-400 hover:border-slate-500 hover:text-slate-300'
                      }`}
                  >
                    <input
                      id={`register-role-${role.toLowerCase()}`}
                      type="radio"
                      value={role}
                      className="sr-only"
                      {...register('role', { required: true })}
                    />
                    {role === ROLES.ADMIN
                      ? <ShieldCheck className="w-4 h-4" />
                      : <UserPlus className="w-4 h-4" />
                    }
                    {role}
                  </label>
                ))}
              </div>
            </div>

            {/* Admin Secret (conditional) */}
            {isAdmin && (
              <div className="space-y-1.5 animate-fade-in">
                <label htmlFor="register-admin-secret" className="text-sm font-medium text-amber-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin secret key
                </label>
                <div className="relative">
                  <input
                    id="register-admin-secret"
                    type={showAdminSecret ? 'text' : 'password'}
                    placeholder="Enter admin secret"
                    className={`w-full px-4 py-3 pr-12 rounded-xl bg-amber-500/5 border text-white placeholder-slate-500
                      text-sm transition-all duration-200 outline-none
                      focus:ring-2 focus:ring-amber-500/60 focus:border-amber-500
                      ${errors.adminSecret ? 'border-red-500/70 bg-red-500/5' : 'border-amber-500/30 hover:border-amber-500/60'}`}
                    {...register('adminSecret', {
                      required: isAdmin ? 'Admin secret is required for Admin accounts' : false,
                      minLength: isAdmin ? { value: 4, message: 'Secret must be at least 4 characters' } : undefined,
                    })}
                  />
                  <button
                    id="register-toggle-admin-secret"
                    type="button"
                    onClick={() => setShowAdminSecret((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                    aria-label={showAdminSecret ? 'Hide secret' : 'Show secret'}
                  >
                    {showAdminSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.adminSecret && (
                  <p id="register-admin-secret-error" role="alert" className="text-xs text-red-400 flex items-center gap-1">
                    <span>⚠</span> {errors.adminSecret.message}
                  </p>
                )}
                <p className="text-xs text-amber-500/70 mt-1">
                  Contact your system administrator for the admin secret key.
                </p>
              </div>
            )}

            {/* Submit */}
            <button
              id="register-submit"
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
                  Creating account…
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Create account
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
              <span className="px-3 bg-slate-800/60 text-slate-500">Already have an account?</span>
            </div>
          </div>

          {/* Login link */}
          <Link
            id="register-login-link"
            to={ROUTES.LOGIN}
            className="w-full flex items-center justify-center py-2.5 px-4
              border border-slate-600/60 hover:border-indigo-500/60
              text-slate-300 hover:text-indigo-400
              text-sm font-medium rounded-xl
              transition-all duration-200 hover:bg-indigo-500/5"
          >
            Sign in instead
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
