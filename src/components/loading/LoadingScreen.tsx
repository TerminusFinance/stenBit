import React, {useEffect, useState} from 'react';
import './LoadingScreen.css';
import {useLocation, useNavigate} from 'react-router-dom';
import {getUserById} from "../../core/dataWork/Back4app.ts";
import {useData} from "../DataContext.tsx";
import {isDesktop, isMobile, isTablet} from 'react-device-detect';
import coin from "../../assets/ic_coins.png";

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
                    navigate('/not-found');
                } else {
                    const result = await getUserById(id);
                    if (result.error === 'User not found') {
                        if(!inviteCode) {
                            console.log('User not found');
                            navigate('/start', {state: {id}});
                        } else  {
                            console.log('User not found');
                            navigate('/start', {state: {id, name, inviteCode}});
                        }
                    } else {
                        console.log("set up data - ", result.coins);
                        setData(result);
                        setDataApp(result);
                        navigate('/home/tap');
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
            {/*<div className="image-container">*/}
            {/*    <img src={coin} alt="Image with glow" className="glowing-image"/>*/}
            {/*</div>*/}
            <p className="loading-text">Loading...</p>
        </div>
    );
};

export default LoadingScreen;
