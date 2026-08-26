import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // Auto-dismiss after 4 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === 'success';

  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all duration-300 transform translate-y-0 ${
      isSuccess 
        ? 'bg-emerald-900/90 text-emerald-100 border-emerald-700 backdrop-blur-md' 
        : 'bg-rose-900/90 text-rose-100 border-rose-700 backdrop-blur-md'
    }`}>
      {isSuccess ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
      )}
      <span>{message}</span>
      <button 
        onClick={onClose}
        className="ml-2 text-slate-300 hover:text-white p-0.5 rounded-lg transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}