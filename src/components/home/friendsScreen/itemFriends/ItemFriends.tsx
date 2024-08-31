import React from "react";
import './ItemFriends.css';
import CoinsImg from "../../../../assets/ic_dollar.svg";

interface ItemFriendsParams {
    userName: string;
    coinsReferral: string;
    position: number | string;
    image?: string | null;
    imageCoins?: string | null;
    selected: boolean;
    onClick?: () => void | null;
}

export const ItemFriends: React.FC<ItemFriendsParams> = ({userName, coinsReferral, position, image, selected, imageCoins, onClick}) => {
    return (
        <div className={`item-friend-container-${selected}`} onClick={onClick}>

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
                        {imageCoins == null ? (
                            <img src={CoinsImg} className="ic-coins-friends"/>
                        ) : (
                            <img src={imageCoins} className="ic-coins-friends"/>
                        )}
                        <p className="tx-coin-plus-friends">{coinsReferral}</p>
                    </div>
                </div>
            </div>
            <div/>
            {typeof position == "number" ? (
                <p>#{position}</p>
            ) : <p>{position}</p>}

        </div>
    );
}
