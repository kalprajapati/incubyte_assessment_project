import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

/**
 * Modal
 * A reusable, accessible modal container.
 *
 * Props:
 *  - isOpen   : boolean
 *  - onClose  : () => void
 *  - title    : string
 *  - children : ReactNode
 *  - size     : 'sm' | 'md' | 'lg'  (default 'md')
 */
export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const overlayRef = useRef(null);

  // Trap Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClass = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  }[size] ?? 'max-w-lg';

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={`relative w-full ${sizeClass} bg-slate-800 border border-slate-700/60
          rounded-2xl shadow-2xl animate-modal-in max-h-[90vh] flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/60 flex-shrink-0">
          <h2 id="modal-title" className="text-white font-bold text-lg">{title}</h2>
          <button
            id="modal-close"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg
              text-slate-400 hover:text-white hover:bg-slate-700/70
              transition-all duration-200"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          {children}
        </div>
      </div>

      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modal-in { animation: modal-in 0.2s ease-out both; }
      `}</style>
    </div>
  );
}
