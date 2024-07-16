import React, { useEffect, useRef, useState } from 'react';
import './TapScreen.css';
import coin from '../../../assets/ic_coins.svg';
import { useNavigate } from "react-router-dom";
import { useData } from "../../DataContext.tsx";
import {addCoinsToClickData} from "../../../core/dataWork/RemoteUtilsRequester.ts";
import bronzeLevel from "../../../assets/diamont/diamond-level-bronze.svg";
import silverLevel from "../../../assets/diamont/diamond-level-silver.svg";
import goldLevel from "../../../assets/diamont/diamond-level-gold.svg";
import platinumLevel from "../../../assets/diamont/diamond-level-platinum.svg";
import ProgressBarLevel from "../progressBar/progressBarLevel/ProgressBarLevel.tsx";
import EnergyBadge from "../progressBar/energyBadge/EnergyBadge.tsx";
import { CoinsLevelUpp } from "../progressBar/coinsLevelUpp/CoinsLevelUpp.tsx";
import IcDollar from "../../../assets/ic_dollar.svg";
import NavigationBar from "../../navigationBar/NavigationBar.tsx";
import {calculateThousandsDifference, formatNumber, useTelegramBackButton} from "../../viewComponents/Utils.tsx";

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
        title: 'Bronze',
        description: 'Your number of shares determines the league you enter',
        image: bronzeLevel,
        minProgress: 0,
        maxProgress: 5000,
    },
    {
        id: 2,
        title: 'Silver',
        description: 'Your number of shares determines the league you enter',
        image: silverLevel,
        minProgress: 5000,
        maxProgress: 50000,
    },
    {
        id: 3,
        title: 'Gold',
        description: 'Your number of shares determines the league you enter',
        image: goldLevel,
        minProgress: 50000,
        maxProgress: 150000,
    },
    {
        id: 4,
        title: 'Platinum',
        description: 'Your number of shares determines the league you enter',
        image: platinumLevel,
        minProgress: 150000,
        maxProgress: 500000,
    },
];

const TapScreen: React.FC = () => {

    const { dataApp, setDataApp } = useData();
    const [clicks, setClicks] = useState<number>(dataApp.coins !== undefined && dataApp.coins !== null ? dataApp.coins : 0);
    const [animations, setAnimations] = useState<{ x: number, y: number, id: number }[]>([]);
    const { energy, setEnergy } = useData();
    const navigate = useNavigate();
    const prevClicksRef = useRef<number>(clicks);


    try {
        useTelegramBackButton(false)
    } catch (e ) {
        console.log("error in postEvent - ", e)
    }

    const handleClick = (event: React.MouseEvent<HTMLImageElement>) => {
        if (energy >= dataApp.boosts[1].level) {
            const { clientX, clientY } = event;
            setClicks(prevClicks => prevClicks + dataApp.boosts[1].level);
            setEnergy(prevEnergy => prevEnergy - dataApp.boosts[1].level);
            const id = Date.now();
            setAnimations(prevAnimations => [...prevAnimations, { x: clientX, y: clientY, id }]);
            setTimeout(() => {
                setAnimations(prevAnimations => prevAnimations.filter(animation => animation.id !== id));
            }, 1000);
        }
        navigator.vibrate(50);
    };

    const handleNav = (marsh: string) => {
        if(marsh == "level") {
            navigate('/level', { state: { levelTypes, currentLevel } });
        } else  {
            navigate(`/${marsh}`);
        }
    };

    const sendClickData = async (clickCount: number) => {
        if (dataApp.userId !== undefined) {
            const result = addCoinsToClickData( clickCount);
            console.log("update result - ", await result);
            setDataApp(await result);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (prevClicksRef.current !== clicks) {
                sendClickData(clicks - dataApp.coins);
                prevClicksRef.current = clicks;
            }
        }, 200);

        return () => clearInterval(interval);
    }, [clicks]);

    // useEffect(() => {
    //     console.log("dataApp - ", dataApp.coins);
    //     if(dataApp.userId == "") {
    //         handleNav("loading")
    //     }
    // }, [dataApp]);

    // useEffect(() => {
    //     const energyRegenInterval = setInterval(() => {
    //         setEnergy(prevEnergy => Math.min(prevEnergy + 1, 2000)); // Восстанавливаем энергию до максимума 500
    //     }, 1000); // Восстанавливаем 1 энергию каждую секунду
    //
    //     return () => clearInterval(energyRegenInterval);
    // }, []);
    //


    const currentLevel = getCurrentLevel(clicks);


    return (
        <div className="tap-container">
            <div className="tap-raspred-container">
                <div className="coin-wrapper">
                    <div className="count-div">
                        <img src={IcDollar} alt="Coin" className="coin-small" />
                        <div className="click-count">{formatNumber(clicks)}</div>
                    </div>
                    <CoinsLevelUpp
                        value={calculateThousandsDifference(clicks, currentLevel.maxProgress)}
                        onClick={() =>handleNav('level')}
                    />
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
                                top: animation.y - 240,
                            }}
                        >
                            +{dataApp.boosts[1].level}
                        </div>
                    ))}
                </div>

                <div style={{ width: '100vw', padding: '0 10px', zIndex: 2, marginBottom: '16px', marginTop: '8px' }}>
                    <EnergyBadge current={energy} max={dataApp.maxEnergy} handlerNavBoost={() =>handleNav("boost")} />
                    <ProgressBarLevel
                        title={currentLevel.title}
                        level={`Level: ${currentLevel.id}/${levelTypes.length}`}
                        progress={clicks}
                        maxProgress={currentLevel.maxProgress}
                        onClick={() =>handleNav("level")}
                    />
                </div>
            </div>

            <NavigationBar
                initialSelected={"Earn"}
                onEarnClick={() => {}}
                onInviteClick={() =>handleNav("friends")}
                onProfileClick={() =>handleNav("profile")}
                onTasksClick={() =>handleNav("tasks")}
            />
        </div>
    );
};

export default TapScreen;

export const getCurrentLevel = (clicks: number): LevelType => {
    const level = levelTypes.find(level => clicks >= level.minProgress && clicks < level.maxProgress);
    return level || levelTypes[levelTypes.length - 1];
};