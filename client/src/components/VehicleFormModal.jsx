import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, Save } from 'lucide-react';
import Modal from './Modal';
import { VEHICLE_CATEGORIES } from '../utils/constants';

/**
 * VehicleFormModal
 *
 * Used for both Create (vehicle = null) and Edit (vehicle = {...}).
 *
 * Props:
 *  - isOpen    : boolean
 *  - onClose   : () => void
 *  - onSubmit  : (data) => Promise<void>
 *  - vehicle   : Vehicle | null   (null → create mode)
 *  - loading   : boolean
 */
export default function VehicleFormModal({ isOpen, onClose, onSubmit, vehicle = null, loading = false }) {
  const isEdit = Boolean(vehicle);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: 'onTouched' });

  // Populate form when editing, clear when creating/closing
  useEffect(() => {
    if (isOpen) {
      reset(
        isEdit
          ? { make: vehicle.make, model: vehicle.model, category: vehicle.category,
              price: vehicle.price, quantity: vehicle.quantity }
          : { make: '', model: '', category: '', price: '', quantity: '' }
      );
    }
  }, [isOpen, isEdit, vehicle, reset]);

  // Input field shared classes
  const inputCls = (hasError) =>
    `w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border text-white placeholder-slate-500
     text-sm outline-none transition-all duration-200
     focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500
     ${hasError ? 'border-red-500/70 bg-red-500/5' : 'border-slate-600/60 hover:border-slate-500'}`;

  const labelCls = 'block text-sm font-medium text-slate-300 mb-1.5';
  const errorCls = 'mt-1 text-xs text-red-400 flex items-center gap-1';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Vehicle' : 'Add New Vehicle'}
      size="md"
    >
      <form id="vehicle-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

        {/* Make */}
        <div>
          <label htmlFor="vf-make" className={labelCls}>Make <span className="text-red-400">*</span></label>
          <input
            id="vf-make"
            type="text"
            placeholder="e.g. Toyota"
            className={inputCls(errors.make)}
            {...register('make', {
              required: 'Make is required',
              minLength: { value: 1, message: 'Make cannot be empty' },
              maxLength: { value: 60, message: 'Make must be 60 characters or less' },
            })}
          />
          {errors.make && <p className={errorCls} role="alert"><span>⚠</span>{errors.make.message}</p>}
        </div>

        {/* Model */}
        <div>
          <label htmlFor="vf-model" className={labelCls}>Model <span className="text-red-400">*</span></label>
          <input
            id="vf-model"
            type="text"
            placeholder="e.g. Camry"
            className={inputCls(errors.model)}
            {...register('model', {
              required: 'Model is required',
              maxLength: { value: 60, message: 'Model must be 60 characters or less' },
            })}
          />
          {errors.model && <p className={errorCls} role="alert"><span>⚠</span>{errors.model.message}</p>}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="vf-category" className={labelCls}>Category <span className="text-red-400">*</span></label>
          <select
            id="vf-category"
            className={`${inputCls(errors.category)} appearance-none cursor-pointer`}
            {...register('category', { required: 'Category is required' })}
          >
            <option value="" className="bg-slate-900 text-slate-400">Select a category</option>
            {VEHICLE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat} className="bg-slate-900 text-white">{cat}</option>
            ))}
          </select>
          {errors.category && <p className={errorCls} role="alert"><span>⚠</span>{errors.category.message}</p>}
        </div>

        {/* Price + Quantity side-by-side */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="vf-price" className={labelCls}>Price ($) <span className="text-red-400">*</span></label>
            <input
              id="vf-price"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              className={inputCls(errors.price)}
              {...register('price', {
                required: 'Price is required',
                min: { value: 0, message: 'Price must be ≥ 0' },
                valueAsNumber: true,
                validate: (v) => !isNaN(v) || 'Price must be a number',
              })}
            />
            {errors.price && <p className={errorCls} role="alert"><span>⚠</span>{errors.price.message}</p>}
          </div>
          <div>
            <label htmlFor="vf-quantity" className={labelCls}>Quantity <span className="text-red-400">*</span></label>
            <input
              id="vf-quantity"
              type="number"
              min="0"
              step="1"
              placeholder="0"
              className={inputCls(errors.quantity)}
              {...register('quantity', {
                required: 'Quantity is required',
                min: { value: 0, message: 'Quantity must be ≥ 0' },
                valueAsNumber: true,
                validate: (v) => Number.isInteger(v) || 'Quantity must be a whole number',
              })}
            />
            {errors.quantity && <p className={errorCls} role="alert"><span>⚠</span>{errors.quantity.message}</p>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2 border-t border-slate-700/50">
          <button
            id="vf-cancel"
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
            id="vf-submit"
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4
              bg-gradient-to-r from-indigo-600 to-purple-600
              hover:from-indigo-500 hover:to-purple-500
              disabled:from-indigo-800 disabled:to-purple-800 disabled:cursor-not-allowed
              text-white font-semibold text-sm rounded-xl
              shadow-lg shadow-indigo-500/20 transition-all duration-200 active:scale-[0.98]"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : <><Save className="w-4 h-4" />{isEdit ? 'Save Changes' : 'Add Vehicle'}</>}
          </button>
        </div>
      </form>
    </Modal>
  );
}
