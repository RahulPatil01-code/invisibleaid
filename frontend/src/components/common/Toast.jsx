import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[60] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onRemove }) {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-amber-50 border-amber-200',
    info: 'bg-blue-50 border-blue-200',
  };

  return (
    <div className={`pointer-events-auto flex items-start gap-3 p-4 rounded-lg border shadow-lg transform transition-all duration-300 animate-slide-in-right bg-white`}>
      <div className="flex-shrink-0 mt-0.5">{icons[toast.type] || icons.info}</div>
      <div className="flex-1 text-sm font-medium text-gray-800">{toast.message}</div>
      <button onClick={onRemove} className="flex-shrink-0 text-gray-400 hover:text-gray-600 focus:outline-none">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function Toast({ message, type = 'info', onClose }) {
  if (!message) return null;
  return (
    <div className="fixed top-4 right-4 z-50">
      <ToastItem toast={{ id: 'inline', message, type }} onRemove={onClose || (() => {})} />
    </div>
  );
}

