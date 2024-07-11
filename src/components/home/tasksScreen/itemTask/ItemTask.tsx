import React from "react";
import './ItemTask.css';
import CoinsIco from '../../../../assets/ic_dollar.svg';
import IcCheck from '../../../../assets/ic_check.svg';
import icRightArrow from "../../../../assets/ic_arrow_right.svg";
import IcLoading from "../../../../assets/ic_loading.svg";

export const isSampleTask = (taskType: TaskType): taskType is SampleTask => {
    return taskType.type === 'Sample';
};

export const isOpenUrlTask = (taskType: TaskType): taskType is OpenUrlTask => {
    return taskType.type === 'OpenUrl';
};

export const IsSubscribeToTg = (taskType: TaskType): taskType is SubscribeToTg => {
    return taskType.type === 'SubscribeToTg';
};

export const isCheckFriendsTask = (taskType: TaskType): taskType is CheckFriendsTask => {
    return taskType.type === 'CheckFriends';
};

export const CheckNftTask = (taskType: TaskType): taskType is CheckNftTask => {
    return taskType.type === 'CheckNft';
};

export const IsStockReg = (taskType: TaskType): taskType is StockRegTask => {
    return taskType.type === 'StockReg';
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

export interface StockRegTask {
    type: 'StockReg';
    url: string;
}

export interface SubscribeToTg {
    type: 'SubscribeToTg';
    url: string;
    id: string;
}

export interface CheckFriendsTask {
    type: 'CheckFriends';
    numberOfFriends: number;
}

export type TaskType = SampleTask | OpenUrlTask | CheckNftTask | CheckFriendsTask | SubscribeToTg | StockRegTask;

export interface TaskCardProps {
    id: number; // Уникальный идентификатор задачи
    text: string;
    coins: number;
    completed: boolean;
    checkIcon: string;
    onClick?: () => void;
    taskType: TaskType;
    isLoading: boolean;
}



const ItemTask: React.FC<TaskCardProps> = ({ text, coins, completed, checkIcon, onClick, isLoading }) => {
    return (
        <div className={`tasks-container-${completed}`}  onClick={!isLoading ? onClick : undefined}>
            <img src={checkIcon} className='ic-logo' />
            <div className="progress-text">
                <div className="tx-container">
                    <span className="current">{text}</span>
                    <div className='coins-container'>
                        <img src={CoinsIco} className='ic-coins' />
                        <span className="divider-task">{coins}</span>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <img src={IcLoading} className="action-status-acc"/>
            ): (
                <div>
                    {completed ? (
                        <img src={IcCheck} className="action-status-acc" />
                    ) : (
                        <img src={icRightArrow} className="action-status-acc" />
                    )}
                </div>
            )
            }

        </div>
    );
};

export default ItemTask;
