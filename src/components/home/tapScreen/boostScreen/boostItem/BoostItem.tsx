import React from "react";
import "./BoostItem.css";
import CoinsIco from "../../../../../assets/ic_dollar.svg";
import icRightArrow from "../../../../../assets/ic_arrow_right.svg";

interface BoostItemParams {
    checkIcon: string;
    name: string;
    price: number;
    lvl: number;
}

export const BoostItem : React.FC<BoostItemParams> = ({checkIcon,name, price, lvl}) => {

    return (
        <div>
            <div className={`boost-item-container`} >
                <img src={checkIcon} className='ic-logo'/>
                <div className="progress-text">
                    <div className="tx-container">
                        <span className="current">{name}</span>
                        <div className='coins-container'>
                            <img src={CoinsIco} className='ic-coins'/>
                            <span className="divider-task">{price}</span>
                            <span>{lvl}lvl</span>
                        </div>
                    </div>
                </div>

                    <img src={icRightArrow} className="action-status-acc"/>
            </div>
        </div>
    )
}