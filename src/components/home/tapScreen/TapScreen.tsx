import React, { useState } from 'react';
import './TapScreen.css';
import coin from '../../../assets/ic_coins.svg';
import arrow_right from '../../../assets/ic_arrow_right.svg';
import bronze_cup from '../../../assets/bronze_cup.svg';
import ProgressBar from "../progressBar/ProgressBar.tsx";
import { useNavigate } from "react-router-dom";

const TapScreen: React.FC = () => {
    const [clicks, setClicks] = useState(12131110);
    const [animations, setAnimations] = useState<{ x: number, y: number, id: number }[]>([]);
    const navigate = useNavigate();
    const currentProgress = 300;
    const maxProgress = 500;

    const handleClick = (event: React.MouseEvent<HTMLImageElement>) => {
        const { clientX, clientY } = event;
        setClicks(prevClicks => prevClicks + 1);
        const id = Date.now();
        setAnimations(prevAnimations => [...prevAnimations, { x: clientX, y: clientY, id }]);
        setTimeout(() => {
            setAnimations(prevAnimations => prevAnimations.filter(animation => animation.id !== id));
        }, 1000);
    };

    const handleNav = () => {
        navigate('/home/level');
    };

    return (
        <div className="tap-container">
            <div className="coin-wrapper">
                <div className="count-div">
                    <img src={coin} alt="Coin" className="coin-small" />
                    <div className="click-count">{clicks}</div>
                </div>
                <div className="type-status" onClick={handleNav}>
                    <img src={bronze_cup} alt="Bronze Cup" className="coin-small" />
                    <p className="tx-type-status">Bronze</p>
                    <img src={arrow_right} alt="Arrow Right" />
                </div>
            </div>

            <div className="coin-container">
                <img
                    src={coin}
                    alt="Coin"
                    className="coin"
                    onClick={handleClick}
                />
                {animations.map(animation => (
                    <div
                        key={animation.id}
                        className="increment"
                        style={{ left: animation.x - 75, top: animation.y - 180 }} /* Увеличено на 180px для позиционирования над монетой */
                    >
                        +1
                    </div>
                ))}
            </div>

            <div style={{ width: '100vw', padding: '0 10px' }}>
                <ProgressBar progress={{ current: currentProgress, max: maxProgress }} />
            </div>
        </div>
    );
};

export default TapScreen;
