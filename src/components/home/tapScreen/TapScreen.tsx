import React, { useEffect, useRef, useState } from 'react';
import './TapScreen.css';
import coin from '../../../assets/ic_coins.png';
import arrow_right from '../../../assets/ic_arrow_right.svg';
import ProgressBar from "../progressBar/ProgressBar.tsx";
import { useNavigate } from "react-router-dom";
import { useData } from "../../DataContext.tsx";
import { updateUser } from "../../../core/dataWork/Back4app.ts";
import whiteLevel from "../../../assets/diamont/ic_white_level.png";
import oceanLevel from "../../../assets/diamont/ic_ocean_level.png";
import redLevel from "../../../assets/diamont/ic_red_level.png";
import purpleLevel from "../../../assets/diamont/ic_purple_level.png";

export interface LevelType {
    title: string;
    description: string;
    image: string;
    minProgress: number;
    maxProgress: number;
}

const levelTypes: LevelType[] = [
    {
        title: 'White Level',
        description: 'Your number of shares determines the league you enter',
        image: whiteLevel,
        minProgress: 0,
        maxProgress: 5000,
    },
    {
        title: 'Ocean Level',
        description: 'Your number of shares determines the league you enter',
        image: oceanLevel,
        minProgress: 5000,
        maxProgress: 50000,
    },
    {
        title: 'Red Level',
        description: 'Your number of shares determines the league you enter',
        image: redLevel,
        minProgress: 50000,
        maxProgress: 150000,
    },
    {
        title: 'Purple Level',
        description: 'Your number of shares determines the league you enter',
        image: purpleLevel,
        minProgress: 150000,
        maxProgress: 500000,
    },
];

const TapScreen: React.FC = () => {
    const { dataApp, setDataApp } = useData();
    const [clicks, setClicks] = useState<number>(dataApp.coins !== undefined && dataApp.coins !== null ? dataApp.coins : 0);
    const [animations, setAnimations] = useState<{ x: number, y: number, id: number }[]>([]);
    const [energy, setEnergy] = useState<number>(500);
    const navigate = useNavigate();
    const prevClicksRef = useRef<number>(clicks);

    const handleClick = (event: React.MouseEvent<HTMLImageElement>) => {
        if (energy > 0) {
            const { clientX, clientY } = event;
            setClicks(prevClicks => prevClicks + 1);
            setEnergy(prevEnergy => prevEnergy - 1);
            const id = Date.now();
            setAnimations(prevAnimations => [...prevAnimations, { x: clientX, y: clientY, id }]);
            setTimeout(() => {
                setAnimations(prevAnimations => prevAnimations.filter(animation => animation.id !== id));
            }, 1000);
        }
        navigator.vibrate(50);
    };

    const handleNav = () => {
        navigate('/home/level', { state: { levelTypes, currentLevel } });
    };

    const sendClickData = async (clickCount: number) => {
        if (dataApp.userId !== undefined) {
            const result = updateUser(dataApp.userId, { coins: clickCount });
            console.log("update result - ", await result);
            setDataApp(await result);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (prevClicksRef.current !== clicks) {
                sendClickData(clicks);
                prevClicksRef.current = clicks;
            }
        }, 200);

        return () => clearInterval(interval);
    }, [clicks]);

    useEffect(() => {
        console.log("dataApp - ", dataApp.coins);
    }, [dataApp]);

    useEffect(() => {
        const energyRegenInterval = setInterval(() => {
            setEnergy(prevEnergy => Math.min(prevEnergy + 1, 500)); // Восстанавливаем энергию до максимума 500
        }, 1000); // Восстанавливаем 1 энергию каждую секунду

        return () => clearInterval(energyRegenInterval);
    }, []);

    const getCurrentLevel = (clicks: number): LevelType => {
        const level = levelTypes.find(level => clicks >= level.minProgress && clicks < level.maxProgress);
        return level || levelTypes[levelTypes.length - 1];
    };

    const currentLevel = getCurrentLevel(clicks);

    return (
        <div className="tap-container">
            <div className="coin-wrapper">
                <div className="count-div">
                    <img src={coin} alt="Coin" className="coin-small" />
                    <div className="click-count">{clicks}</div>
                </div>
                <div className="type-status" onClick={handleNav}>
                    <img src={currentLevel.image} alt={currentLevel.title} className="coin-small" />
                    <p className="tx-type-status">{currentLevel.title}</p>
                    <img src={arrow_right} alt="Arrow Right" />
                </div>
            </div>

            <div className="coin-container">
                <img
                    src={coin}
                    alt="Coin"
                    className="coin"
                    draggable="false"
                    onClick={handleClick}
                />
                {animations.map(animation => (
                    <div
                        key={animation.id}
                        className="increment"
                        style={{
                            left: animation.x - 90,
                            top: animation.y - 240
                        }}
                    >
                        +1
                    </div>
                ))}
            </div>

            <div style={{ width: '100vw', padding: '0 10px' }}>
                <ProgressBar progress={{ current: energy, max: 500 }} />
            </div>
        </div>
    );
};

export default TapScreen;
