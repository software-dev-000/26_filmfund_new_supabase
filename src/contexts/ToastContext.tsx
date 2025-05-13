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
      closeButton: true,
      className: 'custom-toast-align',
    });
  };

  const error = (message: string, description?: string, action?: { label: string; onClick: () => void }) => {
    toast.error(message, {
      description,
      action,
      closeButton: true,
      className: 'custom-toast-align',
    });
  };

  const info = (message: string, description?: string, action?: { label: string; onClick: () => void }) => {
    toast.info(message, {
      description,
      action,
      closeButton: true,
      className: 'custom-toast-align',
    });
  };

  const warning = (message: string, description?: string, action?: { label: string; onClick: () => void }) => {
    toast.warning(message, {
      description,
      action,
      closeButton: true,
      className: 'custom-toast-align',
    });
  };

  return (
    <ToastContext.Provider value={{ success, error, info, warning }}>
      {children}
      <Toaster 
        position="bottom-right" 
        richColors 
        closeButton 
        theme="dark"
        style={{ 
          '--toast-bg': 'rgb(30 41 59)',
          '--toast-border': 'rgb(51 65 85)',
        } as React.CSSProperties}
        toastOptions={{
          classNames: {
            toast: 'custom-toast',
            title: 'custom-toast-title',
            description: 'custom-toast-description',
          },
          style: {
            paddingTop: '0.75rem',
            paddingBottom: '0.75rem',
          }
        }}
      />
      <style>{`
        .custom-toast [data-icon] {
          align-self: flex-start;
          margin-top: 0.125rem;
        }
        .custom-toast-title {
          font-size: 0.9rem;
          margin-top: 0;
          line-height: 1.25;
        }
        .custom-toast-description {
          font-size: 0.9rem;
          margin-top: 0.25rem;
        }
      `}</style>
    </ToastContext.Provider>
  );
}; 
