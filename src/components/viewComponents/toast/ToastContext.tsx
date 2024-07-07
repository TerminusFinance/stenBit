import React, { createContext, useContext, useState, ReactNode } from 'react';
import "./Toast.css";
interface ToastContextType {
    showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

interface ToastProviderProps {
    children: ReactNode;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: 'success' | 'error' | 'info' }>>([]);

    const showToast = (message: string, type: 'success' | 'error' | 'info') => {
        const toast = { id: Date.now(), message, type };
        setToasts((prevToasts) => [...prevToasts, toast]);
        setTimeout(() => {
            removeToast(toast.id);
        }, 3000);
    };

    const removeToast = (id: number) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="toast-container">
                {toasts.map((toast) => (
                    <div key={toast.id} className={`toast toast-${toast.type}`}>
                        {toast.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};


