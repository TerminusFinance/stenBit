import React, {useEffect, useState} from "react";
import "./ProfileScreen.css";
import { useData } from "../../DataContext.tsx";
import {useTonConnectUI, useTonWallet} from "@tonconnect/ui-react";
import {getClanByUserId, ResultionGetClanById, updateUser} from "../../../core/dataWork/RemoteUtilsRequester.ts";
import { Address } from "ton-core";
import NavigationBar from "../../navigationBar/NavigationBar.tsx";
import { useNavigate } from "react-router-dom";
import coinIco from "../../../assets/ic_dollar.svg";
import {InviteCard} from "../friendsScreen/FriendsScreen.tsx";
import {getCurrentLevel, levelTypes} from "../tapScreen/TapScreen.tsx";
import {SettingsItem} from "./settingsItem/SettingsItem.tsx";
import IcWallet from "../../../assets/ic_wallet.svg";
import {formatNumberToK, useTelegramBackButton} from "../../viewComponents/Utils.tsx";
import {PremiumDie} from "../../viewComponents/premiumDie/PremiumDie.tsx";
import IcManyPip from "../../../assets/ic_many_pip.svg";

const ProfileScreen: React.FC = () => {

    const { dataApp, setDataApp } = useData();
    const wallet = useTonWallet();
    const navigate = useNavigate();
    const [tonConnectUI] = useTonConnectUI();
    const [userClan, setUserClan] = useState<ResultionGetClanById | null>(null);
    const [setUpAddress,setSetUpAddress ] = useState(false)

    try {
        useTelegramBackButton(true)
    } catch (e ) {
        console.log("error in postEvent - ", e)
    }

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
            setSetUpAddress(true)
            tonConnectUI.modal.open()
        }
    }

    const getUserClanStats =async  () => {
        const userClanResult = await getClanByUserId();
        if (typeof userClanResult === "object") {
            setUserClan(userClanResult);
        } else {
            console.log("resultuserClanResult - ", userClanResult);
        }
    }

    useEffect(() => {
        getUserClanStats()
    }, []);

    useEffect(() => {
        const mestConst = async () => {
            const addressWallet = wallet?.account?.address ? Address.parse(wallet?.account?.address as string) : undefined;
            console.log("addressWallet in mestConst, -", addressWallet)
            if ((dataApp.address == undefined || dataApp.address == "" || dataApp.address == null) && addressWallet !== undefined && setUpAddress) {
                await updateAddressUsers(addressWallet.toString());
            } else {
                await tonConnectUI.disconnect()
            }
        }
        mestConst()

    }, [wallet]);

    const openModalPremium = () => {
        navigate('/boost',
        {state: {openPremModal: true}}
        )
    }

    const navToClan = () => {
        const currentLevel = getCurrentLevel(dataApp.coins);
        navigate('/level', { state: { levelTypes, currentLevel, startPos: "Clan" } });
    }

    return (
        <div className="profile-container">
            <div className="friends-raspred-container">

                <div className="profile-information-container">
                    {dataApp.imageAvatar ?
                        (
                            <img className="image-profile" src={dataApp.imageAvatar}/>
                        ) :
                        (
                            <div className="image-profile">
                                <p style={{fontSize: '24px', color: 'black'}}>{dataApp.userName[0]}</p>
                            </div>
                        )
                    }
                    <p className="tx-name-profile">{dataApp.userName}</p>
                    <div className="line-profile-information"/>
                </div>

                <div className="card-row-profile">
                    <InviteCard title="Balance" reward={`${formatNumberToK(dataApp.coins)}`} imgSrc={coinIco}/>
                    <InviteCard title="Invite friends with premium" reward={currentLevel.title}
                                imgSrc={currentLevel.image}/>
                </div>

                <div className="premium-die-ovner-contaiener">
                    <PremiumDie onClick={openModalPremium}/>
                </div>

                <p className="tx-settings">Settings</p>

                <SettingsItem title={"Connect your wallet"} subtitle={dataApp.address ? "Connected" : "Not connected"}
                              imgItem={IcWallet} onClick={callAddressMenu}/>

                <SettingsItem title={"Your clan"} subtitle={userClan ? `${userClan.clan.clanName}`: "You are not in the clan"}
                              imgItem={IcManyPip} onClick={navToClan}/>

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
