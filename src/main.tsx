import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { SDKProvider } from "@tma.js/sdk-react";

const manifestUrl = 'https://gist.githubusercontent.com/siandreev/75f1a2ccf2f3b4e2771f6089aeb06d7f/raw/d4986344010ec7a2d1cc8a2a9baa57de37aaccb8/gistfile1.txt';

const AppContainer: React.FC = () => {
    const [appHeight, setAppHeight] = useState(window.innerHeight);

    useEffect(() => {
        const updateHeight = () => setAppHeight(window.innerHeight);

        updateHeight();  // Set initial height
        window.addEventListener('resize', updateHeight);

        return () => {
            window.removeEventListener('resize', updateHeight);
        };
    }, []);

    return (
        <div style={{ height: appHeight }}>
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
