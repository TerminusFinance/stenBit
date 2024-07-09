import React, {useEffect, useState} from 'react';
import './LoadingScreen.css';
import {useLocation, useNavigate} from 'react-router-dom';
import {getLevelLeague, getUserById} from "../../core/dataWork/RemoteUtilsRequester.ts";
import {useData} from "../DataContext.tsx";
import {isDesktop, isMobile, isTablet} from 'react-device-detect';
import coin from "../../assets/ic_coins.svg";

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


    const [launchedeParams, setlaunchedeParams] = useState<string>("");
    useEffect(() => {
        const fetchData = async () => {
            try {
                const deviceTypeResult = deviceType();
                console.log("deviceType - ", deviceTypeResult);
                if (deviceTypeResult !== 'Mobile') {
                    navigate('/redirects');
                    return;
                }
                    try {
                        // const launchParams = retrieveLaunchParams();
                        // const params = launchParams.initData
                        if(params != undefined) {
                            // const user = params.user
                            // if(user != undefined) {
                            //     const newId = user.id
                            const newId = 2
                                setlaunchedeParams(newId.toString())
                                const result = await getUserById();
                                const legueReuslt = await getLevelLeague()
                                console.log("legueReuslt - ", legueReuslt)
                                if (typeof result ==="string") {
                                    if(!inviteCode) {
                                        console.log('User not found');
                                        navigate('/start', {state: {newId}});
                                    } else  {
                                        console.log('User not found');
                                        navigate('/start', {state: {newId, inviteCode}});
                                    }
                                } else if (typeof result === 'object'){
                                    console.log("set up data - ", result.coins);
                                    setData(result);
                                    setDataApp(result);
                                    navigate('/tap');
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

            <div className="loading-text">{launchedeParams}</div>

        </div>
    );
};

export default LoadingScreen;
