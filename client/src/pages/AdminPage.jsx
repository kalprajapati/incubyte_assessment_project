import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Car, Plus, Edit2, Trash2, Package, ShieldCheck,
  LogOut, Search, RefreshCw, AlertCircle, Loader2,
  TrendingUp, DollarSign, Archive, BarChart2,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../utils/constants';
import vehicleService from '../services/vehicle.service';
import VehicleFormModal from '../components/VehicleFormModal';
import ConfirmDialog    from '../components/ConfirmDialog';
import RestockModal     from '../components/RestockModal';

// ─── helpers ─────────────────────────────────────────────
const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const CATEGORY_COLORS = {
  Sedan: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
  SUV: 'bg-green-500/15 text-green-400 border-green-500/25',
  Coupe: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
  Hatchback: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/25',
  Truck: 'bg-orange-500/15 text-orange-400 border-orange-500/25',
  Van: 'bg-teal-500/15 text-teal-400 border-teal-500/25',
  Electric: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  Convertible: 'bg-pink-500/15 text-pink-400 border-pink-500/25',
  Wagon: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/25',
  Other: 'bg-slate-500/15 text-slate-400 border-slate-500/25',
};
const getCat = (c) => CATEGORY_COLORS[c] ?? CATEGORY_COLORS.Other;

// ─── Row Skeleton ─────────────────────────────────────────
function RowSkeleton() {
  return (
    <tr className="border-b border-slate-700/40 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-4 bg-slate-700/60 rounded-lg" style={{ width: `${60 + (i * 7) % 30}%` }} />
        </td>
      ))}
    </tr>
  );
}

// ─── Stat Card ────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color, sub }) {
  const colors = {
    indigo: { bg: 'bg-indigo-500/15', text: 'text-indigo-400', border: 'border-indigo-500/20' },
    purple: { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/20' },
    emerald:{ bg: 'bg-emerald-500/15',text: 'text-emerald-400',border: 'border-emerald-500/20' },
    amber:  { bg: 'bg-amber-500/15',  text: 'text-amber-400',  border: 'border-amber-500/20'  },
  }[color] ?? {};
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 flex items-center gap-4 hover:border-slate-600/60 transition-all duration-200">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colors.bg} border ${colors.border}`}>
        <Icon className={`w-6 h-6 ${colors.text}`} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">{label}</p>
        <p className="text-2xl font-bold text-white mt-0.5 truncate">{value}</p>
        {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────
export default function AdminPage() {
  const { user, logout, loading: authLoading } = useAuth();

  // ── Data state ──────────────────────────────────────────
  const [vehicles,    setVehicles]    = useState([]);
  const [fetching,    setFetching]    = useState(true);
  const [fetchError,  setFetchError]  = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // ── Modal state ─────────────────────────────────────────
  const [formModal,    setFormModal]    = useState({ open: false, vehicle: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, vehicle: null });
  const [restockModal, setRestockModal] = useState({ open: false, vehicle: null });

  // ── Table filter ────────────────────────────────────────
  const [tableSearch, setTableSearch] = useState('');

  // ── Fetch all vehicles ──────────────────────────────────
  const fetchVehicles = useCallback(async () => {
    setFetching(true);
    setFetchError('');
    try {
      const data = await vehicleService.getAll();
      setVehicles(Array.isArray(data) ? data : []);
    } catch (err) {
      setFetchError(err.friendlyMessage || 'Failed to load vehicles.');
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => { fetchVehicles(); }, [fetchVehicles]);

  // ── Derived stats ───────────────────────────────────────
  const totalUnits   = vehicles.reduce((s, v) => s + v.quantity, 0);
  const totalValue   = vehicles.reduce((s, v) => s + v.price * v.quantity, 0);
  const outOfStock   = vehicles.filter((v) => v.quantity === 0).length;

  // ── Table filter ────────────────────────────────────────
  const filtered = vehicles.filter((v) => {
    const q = tableSearch.toLowerCase();
    return !q || v.make.toLowerCase().includes(q) || v.model.toLowerCase().includes(q) || v.category.toLowerCase().includes(q);
  });

  // ─── CRUD handlers ──────────────────────────────────────

  const handleFormSubmit = async (data) => {
    setActionLoading(true);
    try {
      if (formModal.vehicle) {
        await vehicleService.update(formModal.vehicle._id, data);
        toast.success(`${data.make} ${data.model} updated successfully.`);
      } else {
        await vehicleService.create(data);
        toast.success(`${data.make} ${data.model} added to inventory.`);
      }
      setFormModal({ open: false, vehicle: null });
      fetchVehicles();
    } catch (err) {
      toast.error(err.friendlyMessage || 'Operation failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.vehicle) return;
    setActionLoading(true);
    try {
      await vehicleService.remove(deleteDialog.vehicle._id);
      toast.success(`${deleteDialog.vehicle.make} ${deleteDialog.vehicle.model} deleted.`);
      setDeleteDialog({ open: false, vehicle: null });
      fetchVehicles();
    } catch (err) {
      toast.error(err.friendlyMessage || 'Delete failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRestock = async ({ quantity }) => {
    if (!restockModal.vehicle) return;
    setActionLoading(true);
    try {
      await vehicleService.restock(restockModal.vehicle._id, Number(quantity));
      toast.success(`Added ${quantity} unit(s) to ${restockModal.vehicle.make} ${restockModal.vehicle.model}.`);
      setRestockModal({ open: false, vehicle: null });
      fetchVehicles();
    } catch (err) {
      toast.error(err.friendlyMessage || 'Restock failed.');
    } finally {
      setActionLoading(false);
    }
  };

  // ─── Render ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col">

      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-52 bg-amber-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl" />
      </div>

      {/* ── Navbar ── */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center shadow">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-white text-sm tracking-tight hidden sm:inline">Admin Dashboard</span>
              <span className="font-bold text-white text-sm tracking-tight sm:hidden">Admin</span>
            </div>
            <span className="hidden sm:inline text-slate-600 text-sm">·</span>
            <span className="hidden sm:inline text-slate-500 text-xs">Car Dealership Inventory</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              id="admin-nav-search"
              to={ROUTES.VEHICLES}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl
                border border-slate-700/60 hover:border-indigo-500/50
                text-slate-400 hover:text-indigo-400 text-sm
                transition-all duration-200"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Search</span>
            </Link>
            <Link
              id="admin-nav-home"
              to={ROUTES.HOME}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl
                border border-slate-700/60 hover:border-slate-500
                text-slate-400 hover:text-white text-sm
                transition-all duration-200"
            >
              <span className="hidden sm:inline text-sm">Dashboard</span>
              <span className="sm:hidden text-sm">Home</span>
            </Link>
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 rounded-full border border-amber-500/20">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-400 text-xs font-semibold">{user?.name}</span>
            </div>
            <button
              id="admin-logout"
              onClick={logout}
              disabled={authLoading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl
                bg-slate-800 hover:bg-red-500/10
                border border-slate-700/60 hover:border-red-500/40
                text-slate-300 hover:text-red-400 text-sm
                transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">

        {/* Page header */}
        <div className="mb-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Inventory Management</h1>
            <p className="text-slate-400 text-sm mt-1">Add, edit, delete, and restock vehicles in real-time.</p>
          </div>
          <div className="flex gap-2">
            <button
              id="admin-refresh"
              onClick={fetchVehicles}
              disabled={fetching}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700/60
                hover:border-slate-500 text-slate-300 hover:text-white text-sm font-medium
                transition-all duration-200 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${fetching ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              id="admin-add-vehicle"
              onClick={() => setFormModal({ open: true, vehicle: null })}
              className="flex items-center gap-2 px-5 py-2.5
                bg-gradient-to-r from-indigo-600 to-purple-600
                hover:from-indigo-500 hover:to-purple-500
                text-white font-semibold text-sm rounded-xl
                shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40
                transition-all duration-200 active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              Add Vehicle
            </button>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
          <StatCard label="Total Models"   value={vehicles.length} icon={Car}        color="indigo" />
          <StatCard label="Total Units"    value={totalUnits}      icon={Archive}    color="purple" sub="across all models" />
          <StatCard label="Inventory Value" value={fmt(totalValue)} icon={DollarSign} color="emerald" sub="at listed price" />
          <StatCard label="Out of Stock"   value={outOfStock}      icon={BarChart2}  color="amber"  sub={outOfStock > 0 ? 'need restocking' : 'all in stock'} />
        </div>

        {/* ── Table card ── */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden">

          {/* Table toolbar */}
          <div className="px-5 py-4 border-b border-slate-700/50 flex flex-col sm:flex-row sm:items-center gap-3">
            <h2 className="text-white font-semibold text-base flex-1">All Vehicles</h2>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <input
                id="admin-table-search"
                type="text"
                placeholder="Filter table…"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-900/60 border border-slate-600/60
                  hover:border-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30
                  text-white placeholder-slate-500 text-sm rounded-xl outline-none transition-all duration-200"
              />
            </div>
          </div>

          {/* Error */}
          {fetchError && (
            <div id="admin-fetch-error" className="m-5 flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {fetchError}
              <button onClick={fetchVehicles} className="ml-auto underline text-xs hover:text-red-300">Retry</button>
            </div>
          )}

          {/* Responsive table wrapper */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-700/50 bg-slate-900/30">
                  {['Make', 'Model', 'Category', 'Price', 'Stock', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fetching
                  ? Array.from({ length: 6 }).map((_, i) => <RowSkeleton key={i} />)
                  : filtered.length === 0
                  ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-14 h-14 bg-slate-800 border border-slate-700/50 rounded-2xl flex items-center justify-center">
                            <Car className="w-7 h-7 text-slate-500" strokeWidth={1.5} />
                          </div>
                          <p className="text-slate-400 font-medium">
                            {tableSearch ? 'No vehicles match your filter.' : 'No vehicles in inventory.'}
                          </p>
                          {!tableSearch && (
                            <button
                              onClick={() => setFormModal({ open: true, vehicle: null })}
                              className="text-indigo-400 hover:text-indigo-300 text-sm font-medium underline underline-offset-2"
                            >
                              Add your first vehicle
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                  : filtered.map((v) => (
                    <tr
                      key={v._id}
                      className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors duration-150 group"
                    >
                      <td className="px-4 py-3.5 font-semibold text-white">{v.make}</td>
                      <td className="px-4 py-3.5 text-slate-300">{v.model}</td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getCat(v.category)}`}>
                          {v.category}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-white font-medium">{fmt(v.price)}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${v.quantity > 0 ? 'bg-emerald-400' : 'bg-red-400'}`} />
                          <span className={`font-semibold ${v.quantity > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {v.quantity}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity duration-150">
                          {/* Edit */}
                          <button
                            id={`admin-edit-${v._id}`}
                            title="Edit vehicle"
                            onClick={() => setFormModal({ open: true, vehicle: v })}
                            className="w-8 h-8 flex items-center justify-center rounded-lg
                              border border-slate-600/60 hover:border-indigo-500/60
                              text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10
                              transition-all duration-200"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {/* Restock */}
                          <button
                            id={`admin-restock-${v._id}`}
                            title="Restock vehicle"
                            onClick={() => setRestockModal({ open: true, vehicle: v })}
                            className="w-8 h-8 flex items-center justify-center rounded-lg
                              border border-slate-600/60 hover:border-emerald-500/60
                              text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10
                              transition-all duration-200"
                          >
                            <Package className="w-3.5 h-3.5" />
                          </button>
                          {/* Delete */}
                          <button
                            id={`admin-delete-${v._id}`}
                            title="Delete vehicle"
                            onClick={() => setDeleteDialog({ open: true, vehicle: v })}
                            className="w-8 h-8 flex items-center justify-center rounded-lg
                              border border-slate-600/60 hover:border-red-500/60
                              text-slate-400 hover:text-red-400 hover:bg-red-500/10
                              transition-all duration-200"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          {!fetching && filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-slate-700/50 text-xs text-slate-500">
              Showing <span className="text-slate-300 font-medium">{filtered.length}</span> of{' '}
              <span className="text-slate-300 font-medium">{vehicles.length}</span> vehicles
            </div>
          )}
        </div>
      </main>

      {/* ── Modals ── */}
      <VehicleFormModal
        isOpen={formModal.open}
        onClose={() => setFormModal({ open: false, vehicle: null })}
        onSubmit={handleFormSubmit}
        vehicle={formModal.vehicle}
        loading={actionLoading}
      />

      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, vehicle: null })}
        onConfirm={handleDelete}
        title="Delete Vehicle"
        message={
          deleteDialog.vehicle
            ? <>This will permanently remove <strong className="text-white">{deleteDialog.vehicle.make} {deleteDialog.vehicle.model}</strong> from the inventory. This action cannot be undone.</>
            : ''
        }
        confirmLabel="Delete Vehicle"
        danger
        loading={actionLoading}
      />

      <RestockModal
        isOpen={restockModal.open}
        onClose={() => setRestockModal({ open: false, vehicle: null })}
        onSubmit={handleRestock}
        vehicle={restockModal.vehicle}
        loading={actionLoading}
      />

      {/* Fade-in */}
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
