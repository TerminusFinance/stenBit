import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import React, { } from 'react';
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { SDKProvider } from "@tma.js/sdk-react";
// import {postEvent} from "@tma.js/sdk";

const manifestUrl = 'https://wm-mariupol.com/api/manifest';
// import { initMiniApp } from '@telegram-apps/sdk';
const AppContainer: React.FC = () => {

    try {
        // postEvent('web_app_expand');
        // const [miniApp] = initMiniApp();
        // miniApp.setHeaderColor('#121215');
    }catch (e) {
        console.log("change theme - err", e)
    }

    return (
            <SDKProvider acceptCustomStyles debug>
                <TonConnectUIProvider manifestUrl={manifestUrl}>
                    <React.StrictMode>
                        <App />
                    </React.StrictMode>
                </TonConnectUIProvider>
            </SDKProvider>
    );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<AppContainer />);
