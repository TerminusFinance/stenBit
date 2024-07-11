import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import "./Toast.css";

interface ToastContextType {
    showToast: (message: string, type: 'success' | 'error' | 'info', endTime?: string) => void;
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
    const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: 'success' | 'error' | 'info'; endTime?: string }>>([]);

    const showToast = (message: string, type: 'success' | 'error' | 'info', endTime?: string) => {
        const toast = { id: Date.now(), message, type, endTime };
        setToasts((prevToasts) => [...prevToasts, toast]);

        let duration = 3000; // Default duration

        if (endTime) {
            const endTimestamp = new Date(endTime).getTime();
            duration = endTimestamp - Date.now();
            if (duration <= 0) {
                duration = 3000; // Fallback to default if the endTime is in the past
            }
        }

        setTimeout(() => {
            removeToast(toast.id);
        }, duration);
    };

    const removeToast = (id: number) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="toast-container">
                {toasts.map((toast) => (
                    <Toast key={toast.id} message={toast.message} type={toast.type} endTime={toast.endTime} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info';
    endTime?: string;
}

const Toast: React.FC<ToastProps> = ({ message, type, endTime }) => {
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    useEffect(() => {
        if (endTime) {
            const endTimestamp = new Date(endTime).getTime();
            const updateCountdown = () => {
                const remainingTime = endTimestamp - Date.now();
                setTimeLeft(Math.max(remainingTime, 0));
            };

            updateCountdown();
            const interval = setInterval(updateCountdown, 1000);

            return () => clearInterval(interval);
        }
    }, [endTime]);

    return (
        <div className={`toast toast-${type}`}>
            {message}
            {timeLeft !== null && (
                <div className="toast-timer">
                    {Math.floor(timeLeft / 1000)}s
                </div>
            )}
        </div>
    );
};

