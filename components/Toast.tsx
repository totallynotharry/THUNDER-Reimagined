'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, InfoIcon, X } from 'lucide-react';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function Toast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleToast = (event: CustomEvent) => {
      const { message, type } = event.detail;
      const id = Date.now().toString();
      const newToast = { id, message, type };
      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    };

    window.addEventListener('toast', handleToast as EventListener);
    return () => window.removeEventListener('toast', handleToast as EventListener);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'info':
        return <InfoIcon className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-900 border-green-700';
      case 'error':
        return 'bg-red-900 border-red-700';
      case 'info':
        return 'bg-blue-900 border-blue-700';
      default:
        return '';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${getColor(toast.type)} text-white`}
        >
          {getIcon(toast.type)}
          <span>{toast.message}</span>
          <button
            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            className="ml-auto"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

export const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  window.dispatchEvent(
    new CustomEvent('toast', {
      detail: { message, type },
    })
  );
};