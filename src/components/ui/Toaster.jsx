import React from 'react';
import { X } from 'lucide-react';

export function Toaster({ toasts = [] }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${
            toast.type === 'success'
              ? 'bg-green-500'
              : 'bg-red-500'
          } text-white px-4 py-2 rounded-lg shadow-lg flex items-center justify-between min-w-[300px]`}
        >
          <p>{toast.message}</p>
          <button className="ml-4">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}