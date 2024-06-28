import React from "react";
import './ItemFriends.css';
import {Invitee} from "../../../../core/dataWork/Back4app.ts";
import DogImg from "../../../../assets/dog_img.png";
import CoinsImg from "../../../../assets/ic_coins.png";

export const ItemFriends: React.FC<Invitee> = ({userName, coinsReferral}) => {
    return (
        <div className="item-friend-container">

            <div className="dog-container">
                <img src={DogImg} className="ic-dog"/>
            </div>

            <p>{userName}</p>

            <div className="coins-ref-container">
                <img src={CoinsImg} className="ic-coins"/>
                <p>+{coinsReferral}</p>
            </div>
        </div>
    );
}
