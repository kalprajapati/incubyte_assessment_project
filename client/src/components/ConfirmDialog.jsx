import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import Modal from './Modal';

/**
 * ConfirmDialog
 *
 * A generic confirmation modal for destructive actions.
 *
 * Props:
 *  - isOpen       : boolean
 *  - onClose      : () => void
 *  - onConfirm    : () => void
 *  - title        : string
 *  - message      : string | ReactNode
 *  - confirmLabel : string  (default 'Confirm')
 *  - danger       : boolean (default true — red confirm button)
 *  - loading      : boolean
 */
export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  danger = true,
  loading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-5">
        {/* Warning icon + message */}
        <div className="flex gap-4 items-start">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
            ${danger ? 'bg-red-500/15 border border-red-500/30' : 'bg-amber-500/15 border border-amber-500/30'}`}>
            <AlertTriangle className={`w-5 h-5 ${danger ? 'text-red-400' : 'text-amber-400'}`} />
          </div>
          <p className="text-slate-300 text-sm leading-relaxed pt-1">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1 border-t border-slate-700/50">
          <button
            id="confirm-cancel"
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
            id="confirm-ok"
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4
              text-white font-semibold text-sm rounded-xl
              transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed
              ${danger
                ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-lg shadow-red-500/20 disabled:from-red-900 disabled:to-rose-900'
                : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-lg shadow-amber-500/20 disabled:from-amber-900'
              }`}
          >
            {loading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
              : confirmLabel
            }
          </button>
        </div>
      </div>
    </Modal>
  );
}
