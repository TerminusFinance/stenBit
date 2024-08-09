import React from 'react';
import './StartScreen.css';
import ic_coins from '../../assets/ic_coins.svg';
import ic_telegram from '../../assets/ic_telegram.svg';
import ic_insta from '../../assets/ic_inst.png';
import ic_vk from '../../assets/ic_vk.png';
import ic_x from '../../assets/ic_x.svg';
import {useLocation, useNavigate} from "react-router-dom";
import {createUser, processInvitationFromInviteCode} from "../../core/dataWork/RemoteUtilsRequester.ts";
import {useData} from "../DataContext.tsx";
import {MainActionBtn} from "../buttons/mainActionBtn/MainActionBtn.tsx";
import {OpenUrl, useTelegramBackButton} from "../viewComponents/Utils.tsx";

const StartScreen: React.FC = () => {

    const navigate = useNavigate();

    try {
        useTelegramBackButton(false)
    } catch (e ) {
        console.log("error in postEvent - ", e)
    }

    const location = useLocation()
    const {inviteCode} = location.state as { inviteCode: string | null }
    const {setDataApp} = useData();

    const goToAbout = async () => {
        try {
            if (inviteCode == null) {
                const result = await createUser(0);
                console.log("result", result);
                setDataApp(result)
                navigate('/tap');
            } else {
                console.log("StartSCREEN - InviteCode - ", inviteCode)
                const result = await processInvitationFromInviteCode(inviteCode);
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
        <div className="main-container-start">

            <div className="logo-container">
                <img src={ic_coins} alt="Logo" className="logo-start"/>
                <p className="tx-logo-start">Terminus</p>
            </div>
            <div className="social-icons">
                <div className="social-button" onClick={() => OpenUrl("https://www.instagram.com/terminusdex")}>
                    <img src={ic_insta} alt="Website" className="icon"/>
                </div>
                <div className="social-button" onClick={() => OpenUrl("https://t.me/TerminusFinance")}>
                    <img src={ic_telegram} alt="Telegram" className="icon"/>
                </div>
                <div className="social-button" onClick={() => OpenUrl("https://vk.com/club226730234")}>
                    <img src={ic_vk} alt="Discord" className="icon"/>
                </div>
                <div className="social-button" onClick={() => OpenUrl("https://x.com/TerminusFinance")}>
                    <img src={ic_x} alt="X" className="icon"/>
                </div>
            </div>
           <MainActionBtn txInBtn={"START PLAYING"} onClick={goToAbout}/>
        </div>
    );
};

export default StartScreen;
