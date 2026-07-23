import React from 'react';
import { Link } from 'react-router-dom';
import { Car, LogOut, ShieldCheck, User, Gauge, Search } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ROLES, ROUTES } from '../utils/constants';

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();

  const isAdmin = user?.role === ROLES.ADMIN;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col">
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-48 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      {/* Top Nav */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow">
              <Car className="w-4 h-4 text-white" strokeWidth={1.8} />
            </div>
            <span className="font-bold text-white text-sm tracking-tight hidden sm:inline">
              Car Dealership Inventory
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              id="dashboard-search-link"
              to={ROUTES.VEHICLES}
              className="flex items-center gap-2 px-4 py-2 rounded-xl
                bg-indigo-500/10 hover:bg-indigo-500/20
                border border-indigo-500/30 hover:border-indigo-500/60
                text-indigo-400 hover:text-indigo-300
                text-sm font-medium transition-all duration-200"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search Vehicles</span>
            </Link>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 rounded-full border border-slate-700/60">
              <div className="w-6 h-6 bg-indigo-500/20 rounded-full flex items-center justify-center">
                <User className="w-3 h-3 text-indigo-400" />
              </div>
              <span className="text-sm text-slate-300 font-medium">{user?.name}</span>
              {isAdmin && (
                <span className="px-1.5 py-0.5 bg-amber-500/15 text-amber-400 text-xs rounded-full font-semibold border border-amber-500/20">
                  Admin
                </span>
              )}
            </div>
            <button
              id="dashboard-logout"
              onClick={logout}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl
                bg-slate-800 hover:bg-red-500/10
                border border-slate-700/60 hover:border-red-500/40
                text-slate-300 hover:text-red-400
                text-sm font-medium transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-10">
        {/* Welcome banner */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 sm:p-8 mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-slate-400 text-sm mb-1">Welcome back 👋</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">{user?.name}</h1>
              <p className="text-slate-400 text-sm mt-1">{user?.email}</p>
            </div>
            <div className={`self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold
              ${isAdmin
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
              }`}>
              {isAdmin
                ? <><ShieldCheck className="w-4 h-4" /> Administrator</>
                : <><User className="w-4 h-4" /> Standard User</>
              }
            </div>
          </div>
        </div>

        {/* Stats cards — placeholder for future data */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Vehicles',  value: '—', icon: Car,        color: 'indigo' },
            { label: 'Active Listings', value: '—', icon: Gauge,      color: 'purple' },
            { label: 'Your Role',       value: user?.role, icon: isAdmin ? ShieldCheck : User, color: isAdmin ? 'amber' : 'slate' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 flex items-center gap-4
              hover:border-slate-600/70 transition-all duration-200">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0
                ${color === 'indigo' ? 'bg-indigo-500/15' : color === 'purple' ? 'bg-purple-500/15' : color === 'amber' ? 'bg-amber-500/15' : 'bg-slate-700/60'}`}>
                <Icon className={`w-5 h-5
                  ${color === 'indigo' ? 'text-indigo-400' : color === 'purple' ? 'text-purple-400' : color === 'amber' ? 'text-amber-400' : 'text-slate-400'}`} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
                <p className="text-xl font-bold text-white mt-0.5">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Protected content notice */}
        <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-6 h-6 text-indigo-400" />
          </div>
          <h2 className="text-white font-semibold mb-1">Protected Dashboard</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            You are successfully authenticated. This page is only accessible to logged-in users.
            Vehicle inventory features will be available here.
          </p>
        </div>
      </main>

      {/* Fade-in animation */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.4s ease-out both; }
      `}</style>
    </div>
  );
}
