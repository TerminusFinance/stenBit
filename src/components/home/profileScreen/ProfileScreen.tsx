import React, {useEffect, useState} from "react";
import "./ProfileScreen.css";
import coinIcon from "../../../assets/ic_coins.png";
import {useData} from "../../DataContext.tsx";
import {TonConnectButton, useTonWallet} from "@tonconnect/ui-react";
import {updateUser} from "../../../core/dataWork/Back4app.ts";
import {Address} from "ton-core";
import {BottomSheetInviteUser} from "./bottomSheetInviteUser/BottomSheetInviteUser.tsx";

const ProfileScreen: React.FC = () => {
    const {dataApp, setDataApp} = useData();
    const wallet = useTonWallet()
    const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);

    const openBottomSheet = () => {
            setBottomSheetVisible(true);
    };

    const closeBottomSheet = () => {
        setBottomSheetVisible(false);
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text)
        closeBottomSheet()
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

    // const formatAddress = (address: string) => {
    //     if (address && address.length > 10) {
    //         return `${address.substring(0, 5)}...${address.substring(address.length - 5)}`;
    //     }
    //     return address;
    // };

    return (
        <div className="profile-container">
            <div>
                <div className="profile-information-container">
                    <div className="image-profile"/>
                    <p className="tx-name-profile">{dataApp.userName}</p>
                </div>

                {/*update visibli connect table*/}
                {/*{dataApp.address ? (*/}
                {/*    <div className="div-container-address-pr">*/}
                {/*        <p className="address-tx">{formatAddress(dataApp.address)}</p>*/}
                {/*    </div>*/}
                {/*) : (*/}
                {/*    <TonConnectButton/>*/}
                {/*)}*/}
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

            <button className="start-button" onClick={openBottomSheet}>Invite users →</button>
                <BottomSheetInviteUser
                    isVisible={isBottomSheetVisible}
                    onClose={closeBottomSheet}
                    content={
                        <div className="sheet-task-container">
                            <p className="tx-h1-link">Your link to invite friends</p>
                            <p className="tx-h2-link-c" onClick={() => handleCopy(`https://t.me/StenBitTestBot/start=${dataApp.codeToInvite}`)}>https://t.me/StenBitTestBot/start={dataApp.codeToInvite}</p>
                        </div>
                    }
                />

        </div>
    );
}


export default ProfileScreen;