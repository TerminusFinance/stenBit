import React from 'react';
import './EnergyBadge.css';
import boltIcon from '../../../../assets/ic_bolt.svg';
import rocketIcon from '../../../../assets/ic_rocket.svg';

interface EnergyBadgeProps {
    current: number;
    max: number;
    handlerNavBoost: () => void
}

const EnergyBadge: React.FC<EnergyBadgeProps> = ({ current, max, handlerNavBoost }) => {
    return (
        <div className="energy-badge-container">
            <div className="energy-info">
                <img src={boltIcon} className="energy-icon" alt="bolt icon"/>
                <span className="energy-text">{current}</span>
                <span className="energy-text-gray">/{max}</span>
            </div>
            <button className="boost-button" onClick={handlerNavBoost}>
            <img src={rocketIcon} className="boost-icon" alt="boost icon" />
                Boost
            </button>
        </div>
    );
};

export default EnergyBadge;
