import React from "react";
import "./RedirectsScreen.css";
import tgQr from '../../assets/tg_qr.png';

export const RedirectsScreen: React.FC = () => {

    return(
        <div className="redirects-container">

            <p className="tx-play-mobile">Play on your mobile</p>
            <img src={tgQr} className="img-tg-qr"/>

        </div>
    )
}