import React, {useEffect, useState} from 'react';
import './LoadingScreen.css';
import ic_coins_loading from '../../assets/ic_coins_loading.png'
import {useLocation, useNavigate} from "react-router-dom";
import {getUserById} from "../../core/dataWork/Back4app.ts";
import {useData} from "../DataContext.tsx";

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
    const [data, setData] = useState<UserData | null>(null);
    const {setDataApp} = useData();
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("id переданный - ", id, "name переданный - ", name)
                if (!id || !name) {
                    navigate('/not-found');
                } else {
                    const thisId = id
                    const result = await getUserById(thisId); // Пример ID пользователя
                    if (result.error === 'User not found') {
                        console.log('User not found');
                        navigate('/start', {
                            state: {
                                id: thisId
                            }
                        });
                    } else {
                        console.log("set up data - ", result.coins)
                        setData(result);
                        setDataApp(result)
                        navigate('/home/tap');
                    }

                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
        console.log("result - ", data);

        // const timer = setTimeout(() => {
        //     console.log("Navigation triggered");
        //     navigate('/start');
        // }, 2000); // задержка 2 секунды
        //
        // return () => clearTimeout(timer); // очистка таймера при размонтировании компонента
    }, [navigate]);


    return (
        <div className="loading-container">
            <img src={ic_coins_loading} className="logo react" alt="React logo"/>
            <p className="loading-text">Loading...</p>
        </div>
    );
};

export default LoadingScreen;
