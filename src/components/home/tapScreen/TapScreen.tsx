import React, { useEffect, useRef, useState } from 'react';
import './TapScreen.css';
import coin from '../../../assets/ic_coins.svg';
import { useLocation, useNavigate } from 'react-router-dom';
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
import { InviteClanModal } from "../../viewComponents/inviteClanModal/InviteClanModal.tsx";

export interface LevelType {
    id: number;
    title: string;
    description: string;
    image: string;
    minProgress: number;
    maxProgress: number;
}

export const levelTypes: LevelType[] = [
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
    const touchStartTimeRef = useRef<{ [key: number]: number }>({});
    const { turboBoost } = useData();
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const location = useLocation();
    const inviteCode = location.state?.inviteCode ?? null;
    const [coinsAddedCount, setCoinsAddedCount] = useState<number>(1);
    const [isTurboBoostEnding, setIsTurboBoostEnding] = useState<boolean>(false);

    useEffect(() => {
        console.log("inviteCodeTap - ", inviteCode);
        const hasShownInviteSession = sessionStorage.getItem('hasShownInviteSession') === 'true';

        if (inviteCode && !hasShownInviteSession) {
            openBottomSheet();
            sessionStorage.setItem('hasShownInviteSession', 'true');
        }
    }, [inviteCode]);

    const [isModalPremiumVisible, setModalPremiumVisible] = useState(false);

    const openBottomSheet = () => {
        setModalPremiumVisible(true);
    };

    const closeBottomSheet = () => {
        setModalPremiumVisible(false);
    };

    try {
        useTelegramBackButton(false);
    } catch (e) {
        console.log('error in postEvent - ', e);
    }

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            if (accumulatedClicks > 0 && !isTurboBoostEnding) {
                sendClickData(accumulatedClicks);
                setAccumulatedClicks(0);
            }
        }, 700);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [accumulatedClicks, isTurboBoostEnding]);

    const sendClickData = async (clickCount: number) => {
        if (dataApp.userId !== undefined) {
            const result = await addCoinsToClickData(clickCount);
            console.log("update result - ", result);
            setDataApp(prevDataApp => ({
                ...prevDataApp,
                ...result,
                coins: prevDataApp.coins + clickCount,
            }));
        }
    };


    const handlePointerDown = (event: React.PointerEvent<HTMLImageElement>) => {
        touchStartTimeRef.current[event.pointerId] = Date.now();
    };

    const handlePointerUp = (event: React.PointerEvent<HTMLImageElement>) => {
        const touchDuration = Date.now() - touchStartTimeRef.current[event.pointerId];
        if (touchDuration < 500) {
            handleTouch(event);
        }
        delete touchStartTimeRef.current[event.pointerId];
    };

    // const handleTouchStart = (event: React.TouchEvent<HTMLImageElement>) => {
    //     Array.from(event.touches).forEach(touch => {
    //         touchStartTimeRef.current[touch.identifier] = Date.now();
    //     });
    // };
    //
    // const handleTouchEnd = (event: React.TouchEvent<HTMLImageElement>) => {
    //     Array.from(event.changedTouches).forEach(touch => {
    //         const touchDuration = Date.now() - touchStartTimeRef.current[touch.identifier];
    //         if (touchDuration < 500) {
    //             handleTouch(touch as unknown as Touch);
    //         }
    //         delete touchStartTimeRef.current[touch.identifier];
    //     });
    // };

    const handleTouch = async (touch: React.PointerEvent<HTMLImageElement>) => {
        if (energy < dataApp.boosts[1].level) {
            console.log("Недостаточно энергии для клика!");
            return;
        }

        const { clientX, clientY } = touch;
        const coinElement = touch.target as HTMLImageElement;
        const rect = coinElement.getBoundingClientRect();

        coinElement.style.transition = 'transform 0.1s, transform-origin 0.1s';
        coinElement.style.transformOrigin = `${(clientX - rect.left) / rect.width * 100}% ${(clientY - rect.top) / rect.height * 100}%`;
        coinElement.style.transform = `scale(0.95)`;

        setTimeout(() => {
            coinElement.style.transition = 'transform 0.3s';
            coinElement.style.transform = 'scale(1)';
        }, 35);

        const isTurboBoostActive = turboBoost && turboBoost.trim() !== "";
        const boostLevel = isTurboBoostActive ? dataApp.boosts[1].level * 2 : dataApp.boosts[1].level;
        setCoinsAddedCount(boostLevel);
        const newClicks = clicks + boostLevel;
        setClicks(newClicks);
        const newAccumulatedClicks = accumulatedClicks + boostLevel;
        setAccumulatedClicks(newAccumulatedClicks);

        if (!isTurboBoostActive) {
            setEnergy(prevEnergy => prevEnergy - dataApp.boosts[1].level);
        }

        const id = Date.now();
        setAnimations(prevAnimations => [...prevAnimations, { x: clientX, y: clientY, id }]);
        setTimeout(() => {
            setAnimations(prevAnimations => prevAnimations.filter(animation => animation.id !== id));
        }, 1000);

        // Проверяем оставшееся время турбо-буста
        const now = Date.now();
        const endDateOfWork = new Date(turboBoost || now).getTime();
        const timeLeft = endDateOfWork - now;
        console.log('timeLeft is = ',timeLeft)
        if (timeLeft > 0 && timeLeft <= 2000) {
            console.log('Вошел в отправку данных турбобуста предварительно !!!')
            setIsTurboBoostEnding(true);
            await sendClickData(newAccumulatedClicks);
            setAccumulatedClicks(0);
            setIsTurboBoostEnding(false);
        }

        navigator.vibrate(50);
    };

    const handleNav = (marsh: string) => {
        if (marsh === 'level') {
            navigate('/level', { state: { levelTypes, currentLevel } });
        } else if (marsh === 'boost') {
            navigate(`/${marsh}`, { state: { openPremModal: false } });
        } else {
            navigate(`/${marsh}`);
        }
    };

    const openModalPremium = () => {
        navigate('/boost', { state: { openPremModal: true } });
    };

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
                            onPointerDown={handlePointerDown}
                            onPointerUp={handlePointerUp}
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
                            +{coinsAddedCount}
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

            <InviteClanModal
                isVisible={isModalPremiumVisible}
                onClose={closeBottomSheet}
                onBtnClick={() => {}}
                code={inviteCode || ""}
            />
        </div>
    );
};

export default TapScreen;

export const getCurrentLevel = (clicks: number): LevelType => {
    const level = levelTypes.find(level => clicks >= level.minProgress && clicks < level.maxProgress);
    return level || levelTypes[levelTypes.length - 1];
};