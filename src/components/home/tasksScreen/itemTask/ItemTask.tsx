import React from "react";
import './ItemTask.css';
import CoinsIco from '../../../../assets/ic_coins.svg';
import IcCheck from '../../../../assets/ic_check.svg';
import icRightArrow from "../../../../assets/ic_arrow_right.svg";


export const isSampleTask = (taskType: TaskType): taskType is SampleTask => {
    return taskType.type === 'Sample';
};

export const isOpenUrlTask = (taskType: TaskType): taskType is OpenUrlTask => {
    return taskType.type === 'OpenUrl';
};

export const CheckNftTask = (taskType: TaskType): taskType is CheckNftTask => {
    return taskType.type === 'CheckNft';
};

export interface SampleTask {
    type: 'Sample';
}

export interface OpenUrlTask {
    type: 'OpenUrl';
    url: string;
}

export interface CheckNftTask {
    type: 'CheckNft'
    checkCollectionsAddress: string
}



export type TaskType = SampleTask | OpenUrlTask | CheckNftTask;

export interface TaskCardProps {
    id: number; // Уникальный идентификатор задачи
    text: string;
    coins: number;
    completed: boolean;
    checkIcon: string;
    onClick?: () => void;
    taskType: TaskType; // Новый пропс для типа задачи
}

const ItemTask: React.FC<TaskCardProps> = ({ text, coins, completed, checkIcon, onClick }) => {
    return (
        <div className={`tasks-container-${completed}`} onClick={onClick}>
            <img src={checkIcon} className='ic-logo' />
            <div className="progress-text">
                <div className="tx-container">
                    <span className="current">{text}</span>
                    <div className='coins-container'>
                        <img src={CoinsIco} className='ic-coins' />
                        <span className="divider">{coins}</span>
                    </div>
                </div>
            </div>
            {completed ? (
                <img src={IcCheck} className="action-status-acc" />
            ) : (
                <img src={icRightArrow} className="action-status-acc" />
            )}
        </div>
    );
};

export default ItemTask;
