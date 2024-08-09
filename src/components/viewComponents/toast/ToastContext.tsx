import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import "./Toast.css";

interface ToastContextType {
    showToast: (message: string, type: 'success' | 'error' | 'info', endTime?: string, endWork?: () => void) => void;
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
    const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: 'success' | 'error' | 'info'; endTime?: string; endWork?: () => void }>>([]);

    const showToast = (message: string, type: 'success' | 'error' | 'info', endTime?: string, endWork?: () => void) => {
        const toast = { id: Date.now(), message, type, endTime, endWork };
        setToasts((prevToasts) => [...prevToasts, toast]);

        let duration = 3000; // Default duration

        if (endTime) {
            const endTimestamp = new Date(endTime).getTime();
            const remainingTime = endTimestamp - Date.now();
            duration = Math.max(remainingTime, 0);
        }

        setTimeout(() => {
            removeToast(toast.id);
        }, duration + 500); // Adding 500ms for the fade-out animation
    };

    const removeToast = (id: number) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="toast-container">
                {toasts.map((toast) => (
                    <Toast key={toast.id} message={toast.message} type={toast.type} endTime={toast.endTime} endWork={toast.endWork} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};
interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info';
    endTime?: string;
    endWork?: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, endTime, endWork }) => {
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        let duration = 3000; // Default duration

        if (endTime) {
            const endTimestamp = new Date(endTime).getTime();
            const remainingTime = endTimestamp - Date.now();
            duration = Math.max(remainingTime, 0);
        }

        const hideTimeout = setTimeout(() => {
            setVisible(false);
            if (endWork) endWork(); // Call endWork after the toast is hidden
        }, duration);

        if (endTime) {
            const endTimestamp = new Date(endTime).getTime();
            const updateCountdown = () => {
                const remainingTime = endTimestamp - Date.now();
                setTimeLeft(Math.max(remainingTime, 0));
            };

            updateCountdown();
            const interval = setInterval(updateCountdown, 1000);

            return () => {
                clearInterval(interval);
                clearTimeout(hideTimeout);
            };
        } else {
            return () => clearTimeout(hideTimeout);
        }
    }, [endTime, endWork]);

    return (
        <div className={`toast toast-${type} ${visible ? '' : 'hide'}`}>
            <div className="toast-content">
                <div className="toast-message">{message}</div>
                {timeLeft !== null && (
                    <div className="toast-timer">
                        {Math.floor(timeLeft / 1000)}s
                    </div>
                )}
            </div>
        </div>
    );
};


