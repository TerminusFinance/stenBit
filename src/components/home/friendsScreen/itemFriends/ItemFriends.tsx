import React from "react";
import './ItemFriends.css';
import {Invitee} from "../../../../core/dataWork/RemoteUtilsRequester.ts";
import DogImg from "../../../../assets/dog_img.png";
import CoinsImg from "../../../../assets/ic_dollar.svg";

export const ItemFriends: React.FC<Invitee> = ({userName, coinsReferral}) => {
    return (
        <div className="item-friend-container">

            <div className="container-left-item">
                <div className="dog-container">
                    <img src={DogImg} className="ic-dog"/>
                </div>
                <div className="container-user-stats">
                <p className="tx-name-friends">{userName}</p>
                    <div className="coins-ref-container">
                        <img src={CoinsImg} className="ic-coins-friends"/>
                        <p className="tx-coin-plus-friends">+{coinsReferral}</p>
                    </div>
                </div>
            </div>
            <div/>
            <p>#1</p>
        </div>
    );
}
