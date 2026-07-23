import React from 'react';
import { Car, Tag, Hash, DollarSign, Package } from 'lucide-react';
import { VEHICLE_CATEGORIES } from '../utils/constants';

// Category → colour mapping for the badge
const CATEGORY_COLORS = {
  Sedan:       'bg-blue-500/15 text-blue-400 border-blue-500/25',
  SUV:         'bg-green-500/15 text-green-400 border-green-500/25',
  Coupe:       'bg-purple-500/15 text-purple-400 border-purple-500/25',
  Hatchback:   'bg-yellow-500/15 text-yellow-400 border-yellow-500/25',
  Truck:       'bg-orange-500/15 text-orange-400 border-orange-500/25',
  Van:         'bg-teal-500/15 text-teal-400 border-teal-500/25',
  Electric:    'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  Convertible: 'bg-pink-500/15 text-pink-400 border-pink-500/25',
  Wagon:       'bg-indigo-500/15 text-indigo-400 border-indigo-500/25',
  Other:       'bg-slate-500/15 text-slate-400 border-slate-500/25',
};

function getCategoryColor(category) {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS.Other;
}

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}

export default function VehicleCard({ vehicle }) {
  const { make, model, category, price, quantity } = vehicle;
  const inStock = quantity > 0;

  return (
    <article className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5
      hover:border-indigo-500/40 hover:bg-slate-800/70 hover:shadow-xl hover:shadow-indigo-500/5
      transition-all duration-300 flex flex-col gap-4">

      {/* Icon + Category badge */}
      <div className="flex items-start justify-between gap-2">
        <div className="w-11 h-11 bg-gradient-to-br from-indigo-500/20 to-purple-500/20
          border border-indigo-500/20 rounded-xl flex items-center justify-center
          group-hover:from-indigo-500/30 group-hover:to-purple-500/30 transition-all duration-300">
          <Car className="w-5 h-5 text-indigo-400" strokeWidth={1.8} />
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(category)}`}>
          {category}
        </span>
      </div>

      {/* Make + Model */}
      <div>
        <h3 className="text-white font-bold text-lg leading-tight">
          {make} <span className="text-indigo-400">{model}</span>
        </h3>
      </div>

      {/* Details row */}
      <div className="grid grid-cols-2 gap-3 mt-auto">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-slate-500 uppercase tracking-wide font-medium flex items-center gap-1">
            <DollarSign className="w-3 h-3" /> Price
          </span>
          <span className="text-white font-bold text-base">{formatPrice(price)}</span>
        </div>
        <div className="flex flex-col gap-0.5 items-end">
          <span className="text-xs text-slate-500 uppercase tracking-wide font-medium flex items-center gap-1">
            <Package className="w-3 h-3" /> Stock
          </span>
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${inStock ? 'bg-emerald-400' : 'bg-red-400'}`} />
            <span className={`text-sm font-semibold ${inStock ? 'text-emerald-400' : 'text-red-400'}`}>
              {inStock ? `${quantity} units` : 'Out of stock'}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

// ─── Skeleton card for loading state ─────────────────────
export function VehicleCardSkeleton() {
  return (
    <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-5 flex flex-col gap-4 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="w-11 h-11 bg-slate-700/60 rounded-xl" />
        <div className="w-16 h-6 bg-slate-700/60 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="w-3/4 h-5 bg-slate-700/60 rounded-lg" />
        <div className="w-1/2 h-4 bg-slate-700/40 rounded-lg" />
      </div>
      <div className="grid grid-cols-2 gap-3 mt-auto">
        <div className="space-y-1">
          <div className="w-10 h-3 bg-slate-700/40 rounded" />
          <div className="w-20 h-5 bg-slate-700/60 rounded" />
        </div>
        <div className="space-y-1 items-end flex flex-col">
          <div className="w-10 h-3 bg-slate-700/40 rounded" />
          <div className="w-16 h-5 bg-slate-700/60 rounded" />
        </div>
      </div>
    </div>
  );
}
