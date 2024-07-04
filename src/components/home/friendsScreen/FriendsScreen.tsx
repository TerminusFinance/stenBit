import React, {useState} from "react";
import {useData} from "../../DataContext.tsx";
import "./FriendsScreen.css";
import {ItemFriends} from "./itemFriends/ItemFriends.tsx";
import NavigationBar from "../../navigationBar/NavigationBar.tsx";
import {useNavigate} from "react-router-dom";
import coinIco from "../../../assets/ic_dollar.svg";
import icAddUser from "../../../assets/ic-add-user.svg";
import {ModalInvite} from "./modalInvite/ModalInvite.tsx";
import {MainActionBtn} from "../../buttons/mainActionBtn/MainActionBtn.tsx";

export const FriendsScreen: React.FC = () => {
    const {dataApp} = useData();
    const navigate = useNavigate();
    const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
    const handleNav = (marsh: string) => {
        navigate(`/${marsh}`);
    };


    const openBottomSheet = () => {
        setBottomSheetVisible(true);
    };

    const closeBottomSheet = () => {
        setBottomSheetVisible(false);
    };

    return (
        <div className="friends-root-container">


            <div className="friends-raspred-container">
                <p className="tx-friends-h1">Referral</p>
                <p className="tx-friends-h2">Invite your friends and start earning together</p>

                <div className="line-friends"/>

                <div className="card-container">
                    <div className="card-row">
                        <InviteCard title="Invite friends" reward={2000}/>
                        <InviteCard title="Invite friends with premium" reward={10000}/>
                    </div>
                    <ReferralCard referrals={4} earnings={4564846}/>
                </div>
                {dataApp.listUserInvited ? (
                    <div>
                        {dataApp.listUserInvited.map((invite) => (
                            <ItemFriends userName={invite.userName} userId={invite.userId}
                                         coinsReferral={invite.coinsReferral}/>
                        ))}
                    </div>
                ) : (
                    <div/>
                )}
            </div>

            <div className="btn-action-container">
                <MainActionBtn imageSourse={icAddUser} txInBtn={"Invite Friends"} onClick={openBottomSheet}/>
            </div>

            <NavigationBar
                initialSelected={"Invite"}
                onEarnClick={() => handleNav("tap")}
                onInviteClick={() => {
                }}
                onProfileClick={() => handleNav("profile")}
                onTasksClick={() => handleNav("tasks")}
            />

            <ModalInvite isVisible={isBottomSheetVisible} onClose={closeBottomSheet}
                         userCodeInvite={`${dataApp.codeToInvite}`}/>
        </div>
    );
};

const InviteCard: React.FC<{ title: string; reward: number }> = ({title, reward}) => {
    return (
        <div className="card">
            <div className="card-header">{title}</div>
            <div className="card-body">
                <img src={coinIco} alt="Coin"/>
                <span className="card-sum-invite">+{reward.toLocaleString()}</span>
            </div>
        </div>
    );
};

const ReferralCard: React.FC<{ referrals: number; earnings: number }> = ({referrals, earnings}) => {
    return (
        <div className="card-highlight">
            <div className="card-highlight-header">
                <span className="referrals-title">My referrals:</span>
                <span className="referrals-value">{referrals}</span>
            </div>
            <div className="card-highlight-footer">
                <span className="refferring-title">Your earnings for referring:</span>
                <span className="referrals-value">+{earnings.toLocaleString()}</span>
            </div>
        </div>
    );
};
