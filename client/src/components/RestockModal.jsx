import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, Package } from 'lucide-react';
import Modal from './Modal';

/**
 * RestockModal
 *
 * Props:
 *  - isOpen    : boolean
 *  - onClose   : () => void
 *  - onSubmit  : ({ quantity: number }) => Promise<void>
 *  - vehicle   : Vehicle | null
 *  - loading   : boolean
 */
export default function RestockModal({ isOpen, onClose, onSubmit, vehicle = null, loading = false }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ mode: 'onTouched' });

  useEffect(() => {
    if (isOpen) reset({ quantity: '' });
  }, [isOpen, reset]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Restock Vehicle" size="sm">
      {vehicle && (
        <div className="mb-5 px-4 py-3 bg-slate-900/60 rounded-xl border border-slate-700/50">
          <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">Vehicle</p>
          <p className="text-white font-semibold">{vehicle.make} {vehicle.model}</p>
          <p className="text-slate-400 text-sm mt-1">
            Current stock:{' '}
            <span className={`font-semibold ${vehicle.quantity > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {vehicle.quantity} units
            </span>
          </p>
        </div>
      )}

      <form id="restock-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <label htmlFor="restock-quantity" className="block text-sm font-medium text-slate-300 mb-1.5">
            Units to add <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <input
              id="restock-quantity"
              type="number"
              min="1"
              step="1"
              placeholder="e.g. 10"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border text-white
                placeholder-slate-500 text-sm outline-none transition-all duration-200
                focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500
                ${errors.quantity ? 'border-red-500/70 bg-red-500/5' : 'border-slate-600/60 hover:border-slate-500'}`}
              {...register('quantity', {
                required: 'Quantity is required',
                min: { value: 1, message: 'Must add at least 1 unit' },
                valueAsNumber: true,
                validate: (v) => Number.isInteger(v) || 'Must be a whole number',
              })}
            />
          </div>
          {errors.quantity && (
            <p className="mt-1 text-xs text-red-400 flex items-center gap-1" role="alert">
              <span>⚠</span>{errors.quantity.message}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2 border-t border-slate-700/50">
          <button
            id="restock-cancel"
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-600/60
              hover:border-slate-500 text-slate-300 hover:text-white
              text-sm font-medium transition-all duration-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            id="restock-submit"
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4
              bg-gradient-to-r from-emerald-600 to-teal-600
              hover:from-emerald-500 hover:to-teal-500
              disabled:from-emerald-900 disabled:to-teal-900 disabled:cursor-not-allowed
              text-white font-semibold text-sm rounded-xl
              shadow-lg shadow-emerald-500/20 transition-all duration-200 active:scale-[0.98]"
          >
            {loading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Restocking…</>
              : <><Package className="w-4 h-4" /> Restock</>
            }
          </button>
        </div>
      </form>
    </Modal>
  );
}
