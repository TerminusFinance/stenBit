import React from "react";
import "./BoostItem.css";
import CoinsIco from "../../../../../assets/ic_dollar.svg";
import icRightArrow from "../../../../../assets/ic_arrow_right.svg";

interface BoostItemParams {
    checkIcon: string;
    name: string;
    price: string;
    lvl: number;
    clickable: boolean;
    onClick: () => void;
    textAlertMessage: string;
}

export const BoostItem: React.FC<BoostItemParams> = ({ checkIcon, name, price, lvl, onClick, clickable, textAlertMessage }) => {
    return (
        <div className={`boost-item-outer-container`}>
            <div className={`boost-item-container-${clickable}`} onClick={() => clickable == true ? onClick() : {}}>
                <img src={checkIcon} className='ic-logo' />
                <div className="progress-text">
                    <div className="boost-tx-container">
                        <span className="current-name-boost">{name}</span>
                        {clickable == true ? (
                            <div className='coins-container-boost-item'>
                                <img src={CoinsIco} className='ic-coins'/>
                                <span className="divider-task-boost">{price}</span>
                                <span className="driver-lvl-boost">{lvl}lvl</span>
                            </div>
                        ) : (
                            <div className='coins-container-boost-item'>
                                <span className="driver-lvl-boost">{textAlertMessage}</span>
                            </div>
                        )
                        }
                    </div>
                </div>
                {clickable == true ? (
                    <img src={icRightArrow} className="action-status-acc"/>
                ) : (
                    <div/>
                )}
            </div>
        </div>
    );
};
