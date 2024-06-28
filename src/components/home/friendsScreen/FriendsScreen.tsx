import React from "react";
import {useData} from "../../DataContext.tsx";
import "./FriendsScreen.css";
import {ItemFriends} from "./itemFriends/ItemFriends.tsx";

export const FriendsScreen: React.FC = () => {

    const {dataApp} = useData();
    return (
        <div className="friends-root-container">
            <p className="tx-friends-h1">Пригласите друзей!</p>
            <p className="tx-friends-h2">Список ваших друзей:</p>

            {dataApp.listUserInvite ? (
                <div>
                    {dataApp.listUserInvite.map((invite) => (
                        <ItemFriends userName={invite.userName} userId={invite.userId}
                                     coinsReferral={invite.coinsReferral}/>
                    ))}
                </div>
            ) : (
                <div/>
            )}

        </div>
    );
}