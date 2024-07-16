import React, { useEffect } from "react";
import "./ProfileScreen.css";
import { useData } from "../../DataContext.tsx";
import {useTonConnectUI, useTonWallet} from "@tonconnect/ui-react";
import { updateUser } from "../../../core/dataWork/RemoteUtilsRequester.ts";
import { Address } from "ton-core";
import NavigationBar from "../../navigationBar/NavigationBar.tsx";
import { useNavigate } from "react-router-dom";
import coinIco from "../../../assets/ic_dollar.svg";
import {InviteCard} from "../friendsScreen/FriendsScreen.tsx";
import {getCurrentLevel} from "../tapScreen/TapScreen.tsx";
import {SettingsItem} from "./settingsItem/SettingsItem.tsx";
import IcWallet from "../../../assets/ic_wallet.svg";
import {formatNumberToK, useTelegramBackButton} from "../../viewComponents/Utils.tsx";

const ProfileScreen: React.FC = () => {
    const { dataApp, setDataApp } = useData();
    const wallet = useTonWallet();
    const navigate = useNavigate();
    const [tonConnectUI] = useTonConnectUI();

    try {
        useTelegramBackButton(true)
    } catch (e ) {
        console.log("error in postEvent - ", e)
    }

    // @ts-ignore
    const currentLevel = getCurrentLevel(dataApp.coins);

    const handleNav = (marsh: string) => {
        navigate(`/${marsh}`);
    };

    const updateAddressUsers = async (address: string) => {
            const result = updateUser({ address: address });
            setDataApp(await result);
    };

    const callAddressMenu = () => {
        console.log("address",dataApp.address)
        if(dataApp.address == undefined || dataApp.address === "") {
            tonConnectUI.modal.open()
        } else  {
            console.log("disconect")
            tonConnectUI.disconnect()
        }
    }

    useEffect(() => {
        const addressWallet = wallet?.account?.address ? Address.parse(wallet?.account?.address as string) : undefined;
        if ((dataApp.address === undefined || dataApp.address === "") && addressWallet !== undefined) {
            updateAddressUsers(addressWallet.toString());
        } else if (addressWallet == null) {
            if(dataApp.address != "") {
                updateAddressUsers("");
            }
        }
    }, [wallet]);

    useEffect(() => {
        console.log("dataApp - ", dataApp.coins);
        if(dataApp.userId == "") {
            handleNav("/loading")
        }
    }, [dataApp]);


    return (
        <div className="profile-container">
            <div className="friends-raspred-container">

                <div className="profile-information-container">
                    <div className="image-profile"/>
                    <p className="tx-name-profile">{dataApp.userName}</p>
                    <div className="line-profile-information"/>
                </div>


                <div className="card-row-profile">
                    <InviteCard title="Balance" reward={`${formatNumberToK(dataApp.coins)}`} imgSrc={coinIco}/>
                    <InviteCard title="Invite friends with premium" reward={currentLevel.title} imgSrc={currentLevel.image}/>
                </div>

                <p className="tx-settings">Settings</p>

                <SettingsItem title={"Connect your wallet"} subtitle={dataApp.address ? "Connected" : "Not connected"} imgItem={IcWallet} onClick={callAddressMenu}/>

            </div>
            <NavigationBar
                initialSelected={"Profile"}
                onEarnClick={() => handleNav("tap")}
                onInviteClick={() => handleNav("Friends")}
                onProfileClick={() => {
                }}
                onTasksClick={() => handleNav("tasks")}
            />
        </div>
    );
}

export default ProfileScreen;
