import React from "react";
import './ItemFriends.css';
import CoinsImg from "../../../../assets/ic_dollar.svg";

interface ItemFriendsParams {
    userName: string;
    coinsReferral: string;
    position: number;
    image?: string | null;
    selected: boolean;
}

export const ItemFriends: React.FC<ItemFriendsParams> = ({userName, coinsReferral, position, image, selected}) => {
    return (
        <div className={`item-friend-container-${selected}`}>

            <div className="container-left-item">
                <div className="dog-container">
                    {image != null ?
                        (
                            // <img className="image-profile" src={image}/>
                        <img src={image} className="ic-dog"/>
                        ) :
                        (
                            // <div className="image-profile">
                                <p style={{fontSize: '24px', color: 'black'}}>{userName[0]}</p>
                            // </div>
                        )
                    }
                </div>
                <div className="container-user-stats">
                <p className="tx-name-friends">{userName}</p>
                    <div className="coins-ref-container">
                        <img src={CoinsImg} className="ic-coins-friends"/>
                        <p className="tx-coin-plus-friends">{coinsReferral}</p>
                    </div>
                </div>
            </div>
            <div/>
            <p>#{position}</p>
        </div>
    );
}
