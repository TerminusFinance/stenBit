import React from 'react';
import './StartScreen.css';
import ic_coins from '../../assets/ic_coins.svg';
import ic_telegram from '../../assets/ic_telegram.svg';
import ic_website from '../../assets/ic_website.svg';
import ic_discord from '../../assets/ic_discord.svg';
import ic_x from '../../assets/ic_x.svg';
import {useNavigate} from "react-router-dom";

const StartScreen: React.FC = () => {

    const navigate = useNavigate();

    const goToAbout = () => {
        navigate('/home');
    };
    return (
        <div className="main-container">
            <div className="header">
                <button className="back-button">X</button>
                <h1 className="title">StenBit</h1>
                <button className="menu-button">...</button>
            </div>
            <div className="logo-container">
                <img src={ic_coins} alt="Logo" className="logo" />
            </div>
            <div className="social-icons">
                <div className="social-button">
                    <img src={ic_telegram} alt="Telegram" className="icon" />
                    <span className="social-text">Telegram</span>
                </div>
                <div className="social-button">
                    <img src={ic_website} alt="Website" className="icon" />
                    <span className="social-text">Website</span>
                </div>
                <div className="social-button">
                    <img src={ic_discord} alt="Discord" className="icon" />
                    <span className="social-text">Discord</span>
                </div>
                <div className="social-button">
                    <img src={ic_x} alt="X" className="icon" />
                    <span className="social-text">X</span>
                </div>
            </div>
            <button onClick={goToAbout} className="start-button">START PLAYING →</button>
        </div>
    );
};

export default StartScreen;
