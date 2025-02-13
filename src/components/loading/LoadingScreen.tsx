import React, {useEffect, useState} from 'react';
import './LoadingScreen.css';
import {useLocation, useNavigate} from 'react-router-dom';
import {getLevelLeague, getUserById} from "../../core/dataWork/RemoteUtilsRequester.ts";
import {useData} from "../DataContext.tsx";
import {isDesktop, isMobile, isTablet} from 'react-device-detect';
import coin from "../../assets/ic_coins.svg";
import {useTelegramBackButton} from "../viewComponents/Utils.tsx";
import {retrieveLaunchParams} from "@tma.js/sdk";

interface UserData {
    objectId?: string;
    userId?: string;
    clickCount?: number;
    address?: string;
    inviteCode?: string;
    invitedFriends?: string[];
    error?: string;
}

const LoadingScreen: React.FC = () => {
    const {search} = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(search);
    const inviteCode = params.get('inviteCode');


    const [data, setData] = useState<UserData | null>(null);
    const {setDataApp} = useData();
    const deviceType = (): string => {
        if (isMobile) return 'Mobile';
        if (isTablet) return 'Tablet';
        if (isDesktop) return 'Desktop';
        return 'Unknown';
    };

    try {
        useTelegramBackButton(false)
    } catch (e ) {
        console.log("error in postEvent - ", e)
    }


    useEffect(() => {
        const fetchData = async () => {
            try {
                const deviceTypeResult = deviceType();
                console.log("deviceType - ", deviceTypeResult);
                if (deviceTypeResult !== 'Mobile' && deviceTypeResult !== 'Desktop') {
                    navigate('/redirects');
                    return;
                }
                    try {
                        const { initData } = retrieveLaunchParams();
                        const InitDataStaertParam = initData?.startParam
                        if(params != undefined) {
                            console.log("InitDataStaertParam вот -  ", InitDataStaertParam)
                            if(InitDataStaertParam != undefined) {
                                console.log("Зашел в InitDataStaertParam")
                                const InviteCodeParams = inviteCode != null ? inviteCode : InitDataStaertParam
                                const result = await getUserById();
                                const legueReuslt = await getLevelLeague()
                                console.log("legueReuslt - ", legueReuslt)
                                if (typeof result ==="string") {
                                    console.log("передал в  InitDataStaertParam параметр - ", InitDataStaertParam)
                                    navigate('/start', {state: {inviteCode: InviteCodeParams}});

                                } else if (typeof result === 'object'){
                                    setData(result);
                                    setDataApp(result);
                                    navigate('/tap');
                                }
                            } else  {
                                const result = await getUserById();
                                const legueReuslt = await getLevelLeague()
                                console.log("legueReuslt - ", legueReuslt)
                                if (typeof result ==="string") {

                                    if(!inviteCode) {
                                        console.log('User not found');
                                        navigate('/start', {state: {inviteCode: null}})
                                    } else  {
                                        console.log('User not found');
                                        navigate('/start', {state: {inviteCode}});
                                    }
                                } else if (typeof result === 'object'){
                                    console.log("set up data - ", result.coins);
                                    setData(result);
                                    setDataApp(result);
                                    navigate('/tap');
                                }
                            }

                        } else {
                            if(InitDataStaertParam != undefined) {
                                const InviteCodeParams = inviteCode != null ? inviteCode : InitDataStaertParam
                                const result = await getUserById();
                                const legueReuslt = await getLevelLeague()
                                console.log("legueReuslt - ", legueReuslt)
                                if (typeof result ==="string") {
                                    console.log('User not found');
                                    navigate('/start', {state: {InviteCodeParams}});

                                } else if (typeof result === 'object'){
                                    console.log("set up data - ", result.coins);
                                    setData(result);
                                    setDataApp(result);
                                    navigate('/tap');
                                }
                            }
                        }
                    } catch (e) {
                        navigate('/not-found', {});
                    }

            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
        // navigate('/check');
        console.log("result - ", data);
    }, [navigate])

    return (
        <div className="loading-coin-container">

            <div className="image-container-loading">
                <img
                    src={coin}
                    className="glowing-image"
                    draggable="false"
                />
            </div>

            <div className="loading-text">Loading...</div>

        </div>
    );
};

export default LoadingScreen;
