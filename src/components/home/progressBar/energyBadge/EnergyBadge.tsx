import React from 'react';
import './EnergyBadge.css';
import boltIcon from '../../../../assets/ic_bolt.svg';
import rocketIcon from '../../../../assets/ic_rocket.svg';
import PremiumIc from '../../../../assets/ic_premium_stroke.svg';

interface EnergyBadgeProps {
    current: number;
    max: number;
    handlerNavBoost: () => void;
    handlerPremClick: () => void;
}

const EnergyBadge: React.FC<EnergyBadgeProps> = ({current, max, handlerNavBoost, handlerPremClick}) => {
    return (
        <div className="energy-badge-container">
            <div className="energy-info">
                <img src={boltIcon} className="energy-icon" alt="bolt icon"/>
                <span className="energy-text">{current}</span>
                <span className="energy-text-gray">/{max}</span>
            </div>
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', alignContent: 'center'}}>

                <button className="boost-button" onClick={handlerNavBoost}>
                    <img src={rocketIcon} className="boost-icon" alt="boost icon"/>
                    Boost
                </button>
                <div className="premium-small-button" onClick={handlerPremClick}>
                    <img src={PremiumIc} className="premium-small-button-ic"/>
                </div>

            </div>

        </div>
    );
};

export default EnergyBadge;
