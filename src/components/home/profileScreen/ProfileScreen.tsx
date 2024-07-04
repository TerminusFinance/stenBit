import React, {useEffect} from "react";
import "./ProfileScreen.css";
import coinIcon from "../../../assets/ic_coins.svg";
import {useData} from "../../DataContext.tsx";
import {TonConnectButton, useTonWallet} from "@tonconnect/ui-react";
import {updateUser} from "../../../core/dataWork/Back4app.ts";
import {Address} from "ton-core";
import NavigationBar from "../../navigationBar/NavigationBar.tsx";
import {useNavigate} from "react-router-dom";

const ProfileScreen: React.FC = () => {
    const {dataApp, setDataApp} = useData();
    const wallet = useTonWallet()
    const navigate = useNavigate();
    const handleNav = (marsh: string) => {
        navigate(`/${marsh}`);
    };
    const updateAddressUsers = async (address: string) => {
        const id = dataApp.userId
        if (id != null) {
            const result = updateUser(id, {address: address})
            setDataApp(await result)
        }
    }

    useEffect(() => {
        const addressWallet = wallet?.account?.address ? Address.parse(wallet?.account?.address as string) : undefined
        if ((dataApp.address === undefined || dataApp.address === "") && addressWallet !== undefined) {
            updateAddressUsers(addressWallet.toString());
        } else if(addressWallet == null)  {
            updateAddressUsers("");
        }
    }, [wallet])


    return (
        <div className="profile-container">
            <div className="friends-raspred-container">

                <div>
                    <div className="profile-information-container">
                        <div className="image-profile"/>
                        <p className="tx-name-profile">{dataApp.userName}</p>
                    </div>
                    <TonConnectButton/>
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
            </div>



            <NavigationBar
                initialSelected={"Profile"}
                onEarnClick={() => handleNav("tap")}
                onInviteClick={() =>handleNav("Friends")}
                onProfileClick={() => {}}
                onTasksClick={() => handleNav("tasks")}
            />

        </div>
    );
}

export default ProfileScreen;