import React, { useEffect, useRef, useState } from 'react';
import './TapScreen.css';
import coin from '../../../assets/ic_coins.png';
import { useNavigate } from "react-router-dom";
import { useData } from "../../DataContext.tsx";
import { updateUser } from "../../../core/dataWork/Back4app.ts";
import whiteLevel from "../../../assets/diamont/ic_white_level.png";
import oceanLevel from "../../../assets/diamont/ic_ocean_level.png";
import redLevel from "../../../assets/diamont/ic_red_level.png";
import purpleLevel from "../../../assets/diamont/ic_purple_level.png";
import ProgressBarLevel from "../progressBar/progressBarLevel/ProgressBarLevel.tsx";
import EnergyBadge from "../progressBar/energyBadge/EnergyBadge.tsx";
import {CoinsLevelUpp} from "../progressBar/coinsLevelUpp/CoinsLevelUpp.tsx";
import IcDollar from "../../../assets/ic_dollar.svg";

export interface LevelType {
    id: number;
    title: string;
    description: string;
    image: string;
    minProgress: number;
    maxProgress: number;
}

const levelTypes: LevelType[] = [
    {
        id: 1,
        title: 'White Level',
        description: 'Your number of shares determines the league you enter',
        image: whiteLevel,
        minProgress: 0,
        maxProgress: 5000,
    },
    {
        id: 2,
        title: 'Ocean Level',
        description: 'Your number of shares determines the league you enter',
        image: oceanLevel,
        minProgress: 5000,
        maxProgress: 50000,
    },
    {
        id: 3,
        title: 'Red Level',
        description: 'Your number of shares determines the league you enter',
        image: redLevel,
        minProgress: 50000,
        maxProgress: 150000,
    },
    {
        id: 4,
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
    const [energy, setEnergy] = useState<number>(2000);
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
            setEnergy(prevEnergy => Math.min(prevEnergy + 1, 2000)); // Восстанавливаем энергию до максимума 500
        }, 1000); // Восстанавливаем 1 энергию каждую секунду

        return () => clearInterval(energyRegenInterval);
    }, []);

    const getCurrentLevel = (clicks: number): LevelType => {
        const level = levelTypes.find(level => clicks >= level.minProgress && clicks < level.maxProgress);
        return level || levelTypes[levelTypes.length - 1];
    };

    const currentLevel = getCurrentLevel(clicks);

    const formatNumber = (num: number): string => {
        if (num < 1000) {
            return num.toString();
        }

        return num.toLocaleString('en-US');
    };

    const calculateThousandsDifference = (current: number, max: number): number => {
        const difference = max - current;
        return Math.ceil(difference / 1000);
    };

    return (
        <div className="tap-container">
            <div className="coin-wrapper">
                <div className="count-div">
                    <img src={IcDollar} alt="Coin" className="coin-small" />
                    <div className="click-count">{formatNumber(clicks)}</div>
                </div>
                <CoinsLevelUpp value={calculateThousandsDifference(clicks, currentLevel.maxProgress)} onClick={handleNav}/>
            </div>

            <div className="coin-container">
                <div className="image-container">
                    <img
                        src={coin}
                        alt="Coin"
                        className="tap-coin"
                        draggable="false"
                        onClick={handleClick}
                    />
                </div>

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

            <div style={{ width: '100vw', padding: '0 10px', zIndex: 2 }}>
                <EnergyBadge current={energy} max={2000} />
                <ProgressBarLevel title={currentLevel.title} level={`Level: ${currentLevel.id}/${levelTypes.length}`} progress={clicks} maxProgress={currentLevel.maxProgress} onClick={handleNav} />
            </div>
        </div>
    );

};

export default TapScreen;
