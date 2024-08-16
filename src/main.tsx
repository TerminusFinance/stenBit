import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import React, { } from 'react';
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import {initMiniApp, initSwipeBehavior, SDKProvider} from "@telegram-apps/sdk-react";
import {postEvent} from "@telegram-apps/sdk";

const manifestUrl = 'https://wm-mariupol.com/api/manifest';
const AppContainer: React.FC = () => {

    try {
        postEvent('web_app_expand');
        const [miniApp] = initMiniApp();
        miniApp.setHeaderColor('#121215');
        try {
            const [swipeBehavior] = initSwipeBehavior();
            swipeBehavior.disableVerticalSwipe();
        } catch (e) {
            console.log("change behavor - err", e)
        }
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
