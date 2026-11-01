import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { toPersianDigits } from '../../utils/persian';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'warning' | 'info';
}

interface ToastContextType {
  showToast: (title: string, description?: string, type?: 'success' | 'warning' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (title: string, description?: string, type: 'success' | 'warning' | 'info' = 'success') => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, title, description, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto bg-[#181818] text-white p-3.5 rounded-xl shadow-2xl border border-neutral-700 flex items-start gap-3 transition-all animate-in fade-in slide-in-from-bottom-2 duration-200"
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-[#FA8C16]" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-[#FDF498]" />}
              {(!toast.type || toast.type === 'success') && (
                <CheckCircle2 className="w-5 h-5 text-[#52C41A]" />
              )}
            </div>
            <div className="flex-1 text-right text-xs leading-relaxed">
              <div className="font-semibold text-sm text-neutral-100">{toast.title}</div>
              {toast.description && (
                <div className="text-neutral-400 mt-0.5">{toPersianDigits(toast.description)}</div>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-neutral-500 hover:text-white transition-colors p-0.5"
              aria-label="بستن اعلان"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
