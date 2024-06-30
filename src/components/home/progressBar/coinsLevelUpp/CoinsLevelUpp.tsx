import "./CoinsLevelUpp.css";
import React from "react";
import IcLevelUp from "../../../../assets/level-up.svg";
import icIncoCircle from "../../../../assets/ic_inco_circle.svg"


interface CoinsLevelUppProps {
    value: number;
    onClick?: () => void;
}

export const CoinsLevelUpp: React.FC<CoinsLevelUppProps> = ({value, onClick}) => {

    return (
        <div className="coins-level-upp-container" onClick={onClick}>
            <img className="coins-ico-stat" src={IcLevelUp}/>
            <p className="coins-level-basic-tx">Coins to level up: </p>
            <div className="coins-level-container-value">
                <p className="coins-level-tx-value">{value}K</p>
                <img className="coins-ico-stat" src={icIncoCircle}/>
            </div>
        </div>
    )
}