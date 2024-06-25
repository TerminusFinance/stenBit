import React from "react";
import thunder from "../../../assets/ic_thunder.svg";
import './ProgressBar.css';

interface ProgressBarProps {
    progress: { current: number, max: number } | string;
}


const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
    let current: number, max: number;

    if (typeof progress === 'object') {
        current = progress.current;
        max = progress.max
        const percentage = (current / max) * 100;
        return (
            <div className="progress-bar-container">
                <div className="progress-text">
                    <img src={thunder}/>
                    <span className="current-set">{current}</span>
                    <span className="divider">/</span>
                    <span className="max">{max}</span>
                </div>
                <div className="progress-bar">
                    <div className="progress" style={{ width: `${percentage}%` }}></div>
                </div>
            </div>
        );
    } else  {
        return (
            <div className="progress-bar-container">
                <div className="progress-text">
                    <img src={thunder}/>
                    <span className="current">{progress}</span>
                </div>
                <div className="progress-bar">
                    <div className="progress" style={{ width: `${0}%` }}></div>
                </div>
            </div>
        );
    }

};

export default ProgressBar;