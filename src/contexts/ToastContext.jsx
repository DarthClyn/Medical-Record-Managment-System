import React, { createContext, useContext } from 'react';
import { useToastState } from '../hooks/useToast';
import { Toaster } from '../components/ui/Toaster';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const { toasts, addToast } = useToastState();

  const showSuccess = (message) => addToast(message, 'success');
  const showError = (message) => addToast(message, 'error');

  return (
    <ToastContext.Provider value={{ showSuccess, showError }}>
      {children}
      <Toaster toasts={toasts} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}