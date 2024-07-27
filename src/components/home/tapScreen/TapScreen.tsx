import React, { useEffect, useRef, useState } from 'react';
import './TapScreen.css';
import coin from '../../../assets/ic_coins.svg';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../DataContext.tsx';
import { addCoinsToClickData } from '../../../core/dataWork/RemoteUtilsRequester.ts';
import bronzeLevel from '../../../assets/diamont/diamond-level-bronze.svg';
import silverLevel from '../../../assets/diamont/diamond-level-silver.svg';
import goldLevel from '../../../assets/diamont/diamond-level-gold.svg';
import platinumLevel from '../../../assets/diamont/diamond-level-platinum.svg';
import ProgressBarLevel from '../progressBar/progressBarLevel/ProgressBarLevel.tsx';
import EnergyBadge from '../progressBar/energyBadge/EnergyBadge.tsx';
import { CoinsLevelUpp } from '../progressBar/coinsLevelUpp/CoinsLevelUpp.tsx';
import IcDollar from '../../../assets/ic_dollar.svg';
import NavigationBar from '../../navigationBar/NavigationBar.tsx';
import { calculateThousandsDifference, formatNumber, useTelegramBackButton } from '../../viewComponents/Utils.tsx';

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
    const [accumulatedClicks, setAccumulatedClicks] = useState<number>(0);
    const [animations, setAnimations] = useState<{ x: number, y: number, id: number }[]>([]);
    const { energy, setEnergy } = useData();
    const navigate = useNavigate();
    const timeoutRef = useRef<number | null>(null);
    const {turboBoost} = useData()
    try {
        useTelegramBackButton(false);
    } catch (e) {
        console.log('error in postEvent - ', e);
    }

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const sendClickData = async (clickCount: number) => {
        if (dataApp.userId !== undefined) {
            const result = await addCoinsToClickData(clickCount);
            console.log('update result - ', result);
            setDataApp(prevDataApp => ({
                ...prevDataApp,
                ...result,
                coins: prevDataApp.coins + clickCount, // Обновляем локальное значение кликов
            }));
        }
    };

    const scheduleDataSend = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = window.setTimeout(() => {
            if (accumulatedClicks > 0) {
                sendClickData(accumulatedClicks);
                setAccumulatedClicks(0);
            }
        }, 1500);
    };

    const handleClick = (event: React.MouseEvent<HTMLImageElement>) => {
        if (energy >= dataApp.boosts[1].level) {
            if(turboBoost !== "") {
                turboClick(event)
            } else  {
                simpleClicks(event)
            }
        }
        navigator.vibrate(50);
    };

    const simpleClicks =(event: React.MouseEvent<HTMLImageElement>) => {
        const { clientX, clientY } = event;
        const rect = event.currentTarget.getBoundingClientRect();

        const coinElement = event.currentTarget;
        coinElement.style.transition = 'transform 0.1s, transform-origin 0.1s';
        coinElement.style.transformOrigin = `${(clientX - rect.left) / rect.width * 100}% ${(clientY - rect.top) / rect.height * 100}%`;
        coinElement.style.transform = `scale(0.95)`;

        setTimeout(() => {
            coinElement.style.transition = 'transform 0.3s';
            coinElement.style.transform = 'scale(1)';
        }, 35);

        const newClicks = clicks + dataApp.boosts[1].level;
        setClicks(newClicks);
        const newAccumulatedClicks = accumulatedClicks + dataApp.boosts[1].level;
        setAccumulatedClicks(newAccumulatedClicks);
        setEnergy(prevEnergy => prevEnergy - dataApp.boosts[1].level);
        const id = Date.now();
        setAnimations(prevAnimations => [...prevAnimations, { x: clientX, y: clientY, id }]);
        setTimeout(() => {
            setAnimations(prevAnimations => prevAnimations.filter(animation => animation.id !== id));
        }, 1000);

        if (newAccumulatedClicks >= 10) {
            sendClickData(newAccumulatedClicks);
            setAccumulatedClicks(0);
        } else {
            scheduleDataSend();
        }
    }


    const turboClick = (event: React.MouseEvent<HTMLImageElement>) => {
        const { clientX, clientY } = event;
        const rect = event.currentTarget.getBoundingClientRect();

        const coinElement = event.currentTarget;
        coinElement.style.transition = 'transform 0.1s, transform-origin 0.1s';
        coinElement.style.transformOrigin = `${(clientX - rect.left) / rect.width * 100}% ${(clientY - rect.top) / rect.height * 100}%`;
        coinElement.style.transform = `scale(0.95)`;

        setTimeout(() => {
            coinElement.style.transition = 'transform 0.3s';
            coinElement.style.transform = 'scale(1)';
        }, 35);

        const newClicks = clicks + (dataApp.boosts[1].level * 2);
        setClicks(newClicks);
        const newAccumulatedClicks = accumulatedClicks + (dataApp.boosts[1].level * 2);
        setAccumulatedClicks(newAccumulatedClicks);
        // setEnergy(prevEnergy => prevEnergy - dataApp.boosts[1].level);
        const id = Date.now();
        setAnimations(prevAnimations => [...prevAnimations, { x: clientX, y: clientY, id }]);
        setTimeout(() => {
            setAnimations(prevAnimations => prevAnimations.filter(animation => animation.id !== id));
        }, 1000);

        if (newAccumulatedClicks >= 10) {
            sendClickData(newAccumulatedClicks);
            setAccumulatedClicks(0);
        } else {
            scheduleDataSend();
        }
    }

    const handleNav = (marsh: string) => {
        if (marsh === 'level') {
            navigate('/level', { state: { levelTypes, currentLevel } });
        } else {
            navigate(`/${marsh}`);
        }
    };



    const openModalPremium = () => {
        navigate('/boost',
            {state: {openPremModal: true}}
        )
    }


    const currentLevel = getCurrentLevel(clicks);

    return (
        <div className='tap-container'>
            <div className='tap-raspred-container'>
                <div className='coin-wrapper'>
                    <div className='count-div'>
                        <img src={IcDollar} alt='Coin' className='coin-small' />
                        <div className='click-count'>{formatNumber(clicks)}</div>
                    </div>
                    <CoinsLevelUpp
                        value={calculateThousandsDifference(clicks, currentLevel.maxProgress)}
                        onClick={() => handleNav('level')}
                    />
                </div>

                <div className='coin-container'>
                    <div className='image-container'>
                        <img
                            src={coin}
                            alt='Coin'
                            className='tap-coin'
                            draggable='false'
                            onClick={handleClick}
                        />
                    </div>

                    {animations.map((animation) => (
                        <div
                            key={animation.id}
                            className='increment'
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
                    <EnergyBadge
                        current={energy}
                        max={dataApp.maxEnergy}
                        handlerNavBoost={() => handleNav('boost')}
                        handlerPremClick={openModalPremium}
                    />
                    <ProgressBarLevel
                        title={currentLevel.title}
                        level={`Level: ${currentLevel.id}/${levelTypes.length}`}
                        progress={clicks}
                        maxProgress={currentLevel.maxProgress}
                        onClick={() => handleNav('level')}
                    />
                </div>
            </div>

            <NavigationBar
                initialSelected={'Earn'}
                onEarnClick={() => {}}
                onInviteClick={() => handleNav('friends')}
                onProfileClick={() => handleNav('profile')}
                onTasksClick={() => handleNav('tasks')}
            />


        </div>
    );
};

export default TapScreen;

export const getCurrentLevel = (clicks: number): LevelType => {
    const level = levelTypes.find(level => clicks >= level.minProgress && clicks < level.maxProgress);
    return level || levelTypes[levelTypes.length - 1];
};
