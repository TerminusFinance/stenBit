import React, {useEffect, useState} from 'react';
import './LoadingScreen.css';
import {useLocation, useNavigate} from 'react-router-dom';
import {getLevelLeague, getUserById} from "../../core/dataWork/Back4app.ts";
import {useData} from "../DataContext.tsx";
import {isDesktop, isMobile, isTablet} from 'react-device-detect';
import coin from "../../assets/ic_coins.svg";
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
    const id = params.get('id');
    const name = params.get('name');
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
    const launchParams = retrieveLaunchParams();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const deviceTypeResult = deviceType();
                console.log("deviceType - ", deviceTypeResult);
                if (deviceTypeResult !== 'Mobile') {
                    navigate('/redirects');
                    return;
                }
                console.log("id переданный - ", id, "name переданный - ", name);
                if (!id || !name) {
                    try {
                        if(launchParams.initData?.hash != undefined) {
                            const newId = launchParams.initData?.hash
                            setlaunchedeParams(newId)
                            const result = await getUserById(newId);
                            if (typeof result ==="string") {
                                if(!inviteCode) {
                                    console.log('User not found');
                                    navigate('/start', {state: {newId}});
                                } else  {
                                    console.log('User not found');
                                    navigate('/start', {state: {newId, name: "name", inviteCode}});
                                }
                            } else if (typeof result === 'object'){
                                console.log("set up data - ", result.coins);
                                setData(result);
                                setDataApp(result);
                                navigate('/tap');
                            }
                        }
                    } catch (e) {
                        // @ts-ignore
                        const message = e.message
                        setlaunchedeParams(message)
                        console.error("e - ", e)
                        navigate('/not-found', {
                            state: `${message}`
                        });
                    }
                } else {
                    const result = await getUserById(id);
                    const legueReuslt = await getLevelLeague()
                    console.log("legueReuslt - ", legueReuslt)
                    if (typeof result ==="string") {
                        if(!inviteCode) {
                            console.log('User not found');
                            navigate('/start', {state: {id}});
                        } else  {
                            console.log('User not found');
                            navigate('/start', {state: {id, name, inviteCode}});
                        }
                    } else if (typeof result === 'object'){
                        console.log("set up data - ", result.coins);
                        setData(result);
                        setDataApp(result);
                        navigate('/tap');
                    }
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
        console.log("result - ", data);
    }, [navigate]);

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
