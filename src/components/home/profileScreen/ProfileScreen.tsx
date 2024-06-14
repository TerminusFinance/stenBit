import React from "react";
import "./ProfileScreen.css";
import coinIcon from "../../../assets/ic_coins.svg";

const ProfileScreen: React.FC = () => {

    return (
        <div className="profile-container">

            <div className="profile-information-container">
                <div className="image-profile"/>
                <p className="tx-name-profile">name</p>

            </div>

            <div className="badge-container">
                <div className="badge-section">
                    <span className="badge-title">Reward</span>
                    <div className="badge-value">
                        <img src={coinIcon} alt="Coin" className="badge-icon"/>
                        <span>1,900</span>
                    </div>
                </div>
                <div className="badge-divider"></div>
                <div className="badge-section">
                    <span className="badge-title">Invited</span>
                    <span className="badge-value">78</span>
                </div>
            </div>

            <button  className="start-button">START PLAYING →</button>

        </div>
    );

}

export default ProfileScreen;