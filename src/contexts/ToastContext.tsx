import React, { createContext, useContext, ReactNode } from 'react';
import { toast, Toaster } from 'sonner';

interface ToastContextType {
  success: (message: string, description?: string, action?: { label: string; onClick: () => void }) => void;
  error: (message: string, description?: string, action?: { label: string; onClick: () => void }) => void;
  info: (message: string, description?: string, action?: { label: string; onClick: () => void }) => void;
  warning: (message: string, description?: string, action?: { label: string; onClick: () => void }) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const success = (message: string, description?: string, action?: { label: string; onClick: () => void }) => {
    toast.success(message, {
      description,
      action,
    });
  };

  const error = (message: string, description?: string, action?: { label: string; onClick: () => void }) => {
    toast.error(message, {
      description,
      action,
    });
  };

  const info = (message: string, description?: string, action?: { label: string; onClick: () => void }) => {
    toast.info(message, {
      description,
      action,
    });
  };

  const warning = (message: string, description?: string, action?: { label: string; onClick: () => void }) => {
    toast.warning(message, {
      description,
      action,
    });
  };

  return (
    <ToastContext.Provider value={{ success, error, info, warning }}>
      {children}
      <Toaster position="top-right" richColors />
    </ToastContext.Provider>
  );
}; 