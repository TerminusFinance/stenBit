import React, {useEffect} from 'react';
import './LoadingScreen.css'; // Мы будем использовать CSS для стилизации
import ic_coins_loading from '../../assets/ic_coins_loading.png'
import {useNavigate} from "react-router-dom";

const LoadingScreen: React.FC = () => {

    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            console.log("Navigation triggered");
            navigate('/start');
        }, 2000); // задержка 5 секунд (5000 миллисекунд)

        return () => clearTimeout(timer); // очистка таймера при размонтировании компонента
    }, [navigate]);


    return (
        <div className="loading-container">
            <img src={ic_coins_loading} className="logo react" alt="React logo"/>
            <p className="loading-text">Loading...</p>
        </div>
    );
};

export default LoadingScreen;
