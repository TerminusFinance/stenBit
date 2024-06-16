import React from "react";
import "./ProfileScreen.css";
import coinIcon from "../../../assets/ic_coins.png";
import {useData} from "../../DataContext.tsx";

const ProfileScreen: React.FC = () => {
    const { dataApp } = useData();
    return (
        <div className="profile-container">

            <div className="profile-information-container">
                <div className="image-profile"/>
                <p className="tx-name-profile">{dataApp.userName}</p>

            </div>

            <div className="badge-container">
                <div className="badge-section">
                    <span className="badge-title">Reward</span>
                    <div className="badge-value">
                        <img src={coinIcon} alt="Coin" className="badge-icon"/>
                        <span>1000</span>
                    </div>
                </div>
                <div className="badge-divider"></div>
                <div className="badge-section">
                    <span className="badge-title">Invited</span>
                    <span className="badge-value">78</span>
                </div>
            </div>

            <button  className="start-button">Invite users →</button>

        </div>
    );

}

export default ProfileScreen;