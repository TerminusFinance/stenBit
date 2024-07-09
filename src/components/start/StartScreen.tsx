import React from 'react';
import './StartScreen.css';
import ic_coins from '../../assets/ic_coins.svg';
import ic_telegram from '../../assets/ic_telegram.png';
import ic_website from '../../assets/ic_website.png';
import ic_discord from '../../assets/ic_discord.png';
import ic_x from '../../assets/ic_x.png';
import {useLocation, useNavigate} from "react-router-dom";
import {createUser, processInvitationFromInviteCode} from "../../core/dataWork/RemoteUtilsRequester.ts";
import {useData} from "../DataContext.tsx";
import {postEvent} from "@tma.js/sdk";

const StartScreen: React.FC = () => {

    const navigate = useNavigate();

    try {
        postEvent('web_app_setup_main_button', { is_visible: true });
    } catch (e ) {
        console.log("error in postEvent - ", e)
    }

    const location = useLocation()
    const {id, name, inviteCode} = location.state as { id: string, name: string, inviteCode: string }
    const {setDataApp} = useData();

    const goToAbout = async () => {
        try {
            if (!inviteCode) {
                console.log("id from start - ", id)
                const result = await createUser(id, name, 0);
                console.log("result", result);
                setDataApp(result)
                navigate('/tap');
            } else {
                console.log("id from start - ", id)
                const result = await processInvitationFromInviteCode(inviteCode, id, name);
                if(typeof result === 'object') {
                    console.log("result", result);
                    setDataApp(result)
                    navigate('/tap');
                }
            }
        } catch (error) {
            console.error("Error in goToAbout:", error);
        }
    };

    return (
        <div className="main-container">

            <div className="logo-container">
                <img src={ic_coins} alt="Logo" className="logo"/>
            </div>
            <div className="social-icons">
                <div className="social-button">
                    <img src={ic_telegram} alt="Telegram" className="icon"/>
                    <span className="social-text">Telegram</span>
                </div>
                <div className="social-button">
                    <img src={ic_website} alt="Website" className="icon"/>
                    <span className="social-text">Website</span>
                </div>
                <div className="social-button">
                    <img src={ic_discord} alt="Discord" className="icon"/>
                    <span className="social-text">Discord</span>
                </div>
                <div className="social-button">
                    <img src={ic_x} alt="X" className="icon"/>
                    <span className="social-text">X</span>
                </div>
            </div>
            <button onClick={goToAbout} className="start-button">START PLAYING →</button>
        </div>
    );
};

export default StartScreen;
