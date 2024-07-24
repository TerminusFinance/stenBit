import React from "react";
import PremiumIco from "../../../assets/ic_premium.svg";
import icRightArrow from "../../../assets/ic_arrow_right.svg";
import "./PremiumDie.css";

export const PremiumDie: React.FC<{ onClick: () => void; }> = ({onClick}) => {

    return (
        <div className="premium-die-container">
            <div className="premium-die-second-container" onClick={onClick}>
                <img src={PremiumIco} className='ic-premium-die-logo'/>
                <div className="progress-text-premium-die">
                    <div className="premium-die-tx-container">
                        <span className="current-title-get-premium">Get</span>
                        <span className="driver-subTitle-premium">Experience a variety of benefits</span>
                    </div>
                </div>

                <img src={icRightArrow} className="action-status-acc"/>
            </div>
        </div>
    )
}