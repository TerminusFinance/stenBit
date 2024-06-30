import React from "react";
import "./ProgressBarLevel.css";

interface ProgressBarProps {
    title: string;
    level: string;
    progress: number;
    maxProgress: number;
    onClick?: () => void;
}

const ProgressBarLevel: React.FC<ProgressBarProps> = ({ title, level, progress, maxProgress, onClick }) => {
    const progressPercentage = (progress / maxProgress) * 100;

    return (
        <div className="progress-bar-level-container" onClick={onClick}>
            <div className="progress-bar-level-header">
                <span className="progress-bar-level-tx-info">{title}</span>
                <span className="progress-bar-level-tx-info">{level}</span>
            </div>
            <div className="progress-bar-line">
                <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
            </div>
        </div>
    );
};

export default ProgressBarLevel;