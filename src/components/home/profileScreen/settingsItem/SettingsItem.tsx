import React from "react";
import "./SettingsItem.css";
import IcArrowRight from "../../../../assets/ic_arrow_right.svg";

export const SettingsItem: React.FC<{ title: string, subtitle: string, imgItem: string, onClick: () => void}> = ({title, subtitle, imgItem, onClick}) => {

    return (
        <div className="settings-item-root" onClick={onClick}>
            <div className="container-left-item-settings">
                <div className="ic-container">
                    <img src={imgItem} className="ic-settings"/>
                </div>
                <div className="container-settings-stats">
                    <p className="tx-settings-title">{title}</p>
                    <div className="coins-ref-container">
                        <p className="tx-settings-sub-title">{subtitle}</p>
                    </div>
                </div>
            </div>
            <div/>
            <img src={IcArrowRight} className="ic-setting-arrow"/>
        </div>
    )
}