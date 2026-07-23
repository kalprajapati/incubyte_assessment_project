import React, { useCallback, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Search, X, SlidersHorizontal, Car, ChevronLeft, ChevronRight,
  AlertCircle, SearchX,
} from 'lucide-react';
import { useVehicleSearch } from '../hooks/useVehicleSearch';
import VehicleCard, { VehicleCardSkeleton } from '../components/VehicleCard';
import { VEHICLE_CATEGORIES } from '../utils/constants';

// ─── Debounce helper ─────────────────────────────────────
function useDebounce(fn, delay = 400) {
  const timer = useRef(null);
  return useCallback((...args) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => fn(...args), delay);
  }, [fn, delay]);
}

// ─── Pagination ───────────────────────────────────────────
function Pagination({ pagination, onPageChange }) {
  const { page, totalPages, total, limit } = pagination;
  if (totalPages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to   = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-8 pt-6 border-t border-slate-700/50">
      <p className="text-sm text-slate-400">
        Showing <span className="text-white font-medium">{from}–{to}</span> of{' '}
        <span className="text-white font-medium">{total}</span> vehicles
      </p>
      <div className="flex items-center gap-2">
        <button
          id="pagination-prev"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-700/60
            text-slate-300 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/5
            disabled:opacity-40 disabled:cursor-not-allowed
            text-sm font-medium transition-all duration-200"
        >
          <ChevronLeft className="w-4 h-4" /> Prev
        </button>

        {/* Page pills */}
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
          .reduce((acc, p, idx, arr) => {
            if (idx > 0 && arr[idx - 1] !== p - 1) acc.push('…');
            acc.push(p);
            return acc;
          }, [])
          .map((p, i) =>
            p === '…' ? (
              <span key={`ellipsis-${i}`} className="text-slate-500 px-1 text-sm">…</span>
            ) : (
              <button
                key={p}
                id={`pagination-page-${p}`}
                onClick={() => onPageChange(p)}
                className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all duration-200 border
                  ${p === page
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                    : 'border-slate-700/60 text-slate-300 hover:border-indigo-500/50 hover:text-white hover:bg-indigo-500/5'
                  }`}
              >
                {p}
              </button>
            )
          )
        }

        <button
          id="pagination-next"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-700/60
            text-slate-300 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/5
            disabled:opacity-40 disabled:cursor-not-allowed
            text-sm font-medium transition-all duration-200"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Main Search Page ─────────────────────────────────────
export default function SearchPage() {
  const { vehicles, pagination, loading, error, hasSearched, search, reset } = useVehicleSearch();
  const [currentFilters, setCurrentFilters] = useState({});
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { register, handleSubmit, reset: resetForm, watch, formState: { isDirty } } = useForm({
    defaultValues: { make: '', model: '', category: '', minPrice: '', maxPrice: '' },
  });

  // ── Submit (explicit button click) ────────────────────
  const onSubmit = (data) => {
    setCurrentFilters(data);
    search(data, 1);
  };

  // ── Clear all filters ─────────────────────────────────
  const handleClear = () => {
    resetForm();
    setCurrentFilters({});
    reset();
  };

  // ── Pagination change ─────────────────────────────────
  const handlePageChange = (page) => {
    search(currentFilters, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasActiveFilters = Object.values(currentFilters).some(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-52 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* ── Page Header ── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow">
              <Search className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Vehicle Search</h1>
          </div>
          <p className="text-slate-400 text-sm ml-12">
            Search across make, model, category and price range
          </p>
        </div>

        {/* ── Search Form Card ── */}
        <form
          id="search-form"
          onSubmit={handleSubmit(onSubmit)}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 sm:p-6 mb-6"
        >
          {/* Top row: keyword fields + mobile filter toggle */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            {/* Make */}
            <div className="flex-1 min-w-0">
              <label htmlFor="search-make" className="sr-only">Make</label>
              <div className="relative">
                <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  id="search-make"
                  type="text"
                  placeholder="Make (e.g. Toyota)"
                  className="w-full pl-9 pr-4 py-3 bg-slate-900/70 border border-slate-600/60
                    hover:border-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40
                    text-white placeholder-slate-500 text-sm rounded-xl outline-none transition-all duration-200"
                  {...register('make')}
                />
              </div>
            </div>

            {/* Model */}
            <div className="flex-1 min-w-0">
              <label htmlFor="search-model" className="sr-only">Model</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  id="search-model"
                  type="text"
                  placeholder="Model (e.g. Camry)"
                  className="w-full pl-9 pr-4 py-3 bg-slate-900/70 border border-slate-600/60
                    hover:border-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40
                    text-white placeholder-slate-500 text-sm rounded-xl outline-none transition-all duration-200"
                  {...register('model')}
                />
              </div>
            </div>

            {/* Filter toggle (mobile) */}
            <button
              id="search-filter-toggle"
              type="button"
              onClick={() => setFiltersOpen((v) => !v)}
              className={`sm:hidden flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200
                ${filtersOpen
                  ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                  : 'border-slate-600/60 text-slate-300 hover:border-slate-500'
                }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Price + Category row (always visible on desktop, toggled on mobile) */}
          <div className={`${filtersOpen ? 'flex' : 'hidden sm:flex'} flex-col sm:flex-row gap-3 mb-4`}>
            {/* Category */}
            <div className="flex-1 min-w-0">
              <label htmlFor="search-category" className="sr-only">Category</label>
              <select
                id="search-category"
                className="w-full px-4 py-3 bg-slate-900/70 border border-slate-600/60
                  hover:border-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40
                  text-sm rounded-xl outline-none transition-all duration-200
                  text-white appearance-none cursor-pointer"
                {...register('category')}
              >
                <option value="" className="bg-slate-900 text-slate-400">All Categories</option>
                {VEHICLE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-slate-900 text-white">{cat}</option>
                ))}
              </select>
            </div>

            {/* Min Price */}
            <div className="flex-1 min-w-0">
              <label htmlFor="search-min-price" className="sr-only">Minimum Price</label>
              <input
                id="search-min-price"
                type="number"
                min="0"
                step="500"
                placeholder="Min Price ($)"
                className="w-full px-4 py-3 bg-slate-900/70 border border-slate-600/60
                  hover:border-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40
                  text-white placeholder-slate-500 text-sm rounded-xl outline-none transition-all duration-200"
                {...register('minPrice')}
              />
            </div>

            {/* Max Price */}
            <div className="flex-1 min-w-0">
              <label htmlFor="search-max-price" className="sr-only">Maximum Price</label>
              <input
                id="search-max-price"
                type="number"
                min="0"
                step="500"
                placeholder="Max Price ($)"
                className="w-full px-4 py-3 bg-slate-900/70 border border-slate-600/60
                  hover:border-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40
                  text-white placeholder-slate-500 text-sm rounded-xl outline-none transition-all duration-200"
                {...register('maxPrice')}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              id="search-submit"
              type="submit"
              disabled={loading}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3
                bg-gradient-to-r from-indigo-600 to-purple-600
                hover:from-indigo-500 hover:to-purple-500
                disabled:from-indigo-800 disabled:to-purple-800 disabled:cursor-not-allowed
                text-white font-semibold text-sm rounded-xl
                shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40
                transition-all duration-200 active:scale-[0.98]"
            >
              <Search className="w-4 h-4" />
              {loading ? 'Searching…' : 'Search'}
            </button>

            {(hasActiveFilters || hasSearched) && (
              <button
                id="search-clear"
                type="button"
                onClick={handleClear}
                className="flex items-center gap-2 px-4 py-3
                  border border-slate-600/60 hover:border-red-500/50 hover:bg-red-500/5
                  text-slate-300 hover:text-red-400
                  text-sm font-medium rounded-xl transition-all duration-200"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-700/50">
              {Object.entries(currentFilters).map(([key, val]) => {
                if (!val) return null;
                const labels = { make: 'Make', model: 'Model', category: 'Category', minPrice: 'Min $', maxPrice: 'Max $' };
                return (
                  <span key={key}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10
                      border border-indigo-500/30 text-indigo-300 text-xs rounded-full font-medium">
                    {labels[key]}: {val}
                  </span>
                );
              })}
            </div>
          )}
        </form>

        {/* ── Results area ── */}

        {/* Error state */}
        {error && (
          <div
            id="search-error"
            role="alert"
            className="flex items-center gap-3 px-5 py-4 bg-red-500/10 border border-red-500/30
              rounded-2xl text-red-400 text-sm mb-6"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div id="search-loading" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <VehicleCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* No results */}
        {!loading && hasSearched && !error && vehicles.length === 0 && (
          <div
            id="search-no-results"
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-16 h-16 bg-slate-800/60 border border-slate-700/50 rounded-2xl
              flex items-center justify-center mb-4">
              <SearchX className="w-8 h-8 text-slate-500" />
            </div>
            <h2 className="text-white font-semibold text-lg mb-2">No vehicles found</h2>
            <p className="text-slate-400 text-sm max-w-sm">
              No vehicles match your current filters. Try broadening your search or clearing the filters.
            </p>
            <button
              id="search-no-results-clear"
              onClick={handleClear}
              className="mt-5 flex items-center gap-2 px-5 py-2.5
                bg-indigo-500/10 border border-indigo-500/30 hover:border-indigo-500/60
                text-indigo-400 hover:text-indigo-300 text-sm font-medium rounded-xl transition-all duration-200"
            >
              <X className="w-4 h-4" /> Clear filters
            </button>
          </div>
        )}

        {/* Results grid */}
        {!loading && vehicles.length > 0 && (
          <div id="search-results">
            {/* Results count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-400 text-sm">
                <span className="text-white font-semibold">{pagination.total}</span>{' '}
                {pagination.total === 1 ? 'vehicle' : 'vehicles'} found
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle._id} vehicle={vehicle} />
              ))}
            </div>

            <Pagination pagination={pagination} onPageChange={handlePageChange} />
          </div>
        )}

        {/* Initial state (no search yet) */}
        {!loading && !hasSearched && !error && (
          <div
            id="search-initial"
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/10 to-purple-500/10
              border border-indigo-500/20 rounded-2xl flex items-center justify-center mb-4">
              <Car className="w-8 h-8 text-indigo-400" strokeWidth={1.5} />
            </div>
            <h2 className="text-white font-semibold text-lg mb-2">Find your perfect vehicle</h2>
            <p className="text-slate-400 text-sm max-w-sm">
              Use the filters above to search by make, model, category or price range.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
