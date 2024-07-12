import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import React, { useEffect, useRef } from 'react';
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { SDKProvider } from "@tma.js/sdk-react";

const manifestUrl = 'https://gist.githubusercontent.com/siandreev/75f1a2ccf2f3b4e2771f6089aeb06d7f/raw/d4986344010ec7a2d1cc8a2a9baa57de37aaccb8/gistfile1.txt';

const AppContainer: React.FC = () => {
    const appRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleResize = () => {
            if (appRef.current) {
                const appHeight = appRef.current.offsetHeight;
                document.documentElement.style.setProperty('--app-height', `${appHeight}px`);
            }
        };

        const observer = new ResizeObserver(handleResize);
        if (appRef.current) {
            observer.observe(appRef.current);
        }

        handleResize();  // Set initial height

        return () => {
            if (appRef.current) {
                observer.unobserve(appRef.current);
            }
        };
    }, []);

    return (
        <div ref={appRef} style={{ height: 'var(--app-height)' }}>
            <SDKProvider acceptCustomStyles debug>
                <TonConnectUIProvider manifestUrl={manifestUrl}>
                    <React.StrictMode>
                        <App />
                    </React.StrictMode>
                </TonConnectUIProvider>
            </SDKProvider>
        </div>
    );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<AppContainer />);
