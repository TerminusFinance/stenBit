import React from "react";
import "./ProgressBarLeagues.css";
import FlashIc from "../../../../assets/ic_flash.svg";

interface ProgressBarLeaguesProps {
    progress: { current: number, max: number };
    energy: { current: number, max: number };
    type: string;
}

export const ProgressBarLeagues: React.FC<ProgressBarLeaguesProps> = ({progress, energy, type}) => {
    const percentage = (progress.current / progress.max) * 100;
    return (
        <div className="progress-bar-leagues-container">
            <div className="progress-bar-league">
                <div className="progress-label">
                    <div className="container-energy">
                        <img src={FlashIc} className="ic-flash-leagues"/>
                        <p className="tx-energy-current-leagues">{energy.current}</p>
                        <p className="tx-energy-max-leagues">/{energy.max}</p>
                    </div>

                    <p className="tx-progress-leagues">{progress.current}/{progress.max}</p>

                </div>
                <div className={`progress-league-${type}`} style={{width: `${percentage}%`}}></div>
            </div>
        </div>
    );
};