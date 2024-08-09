import React, {useEffect, useState} from "react";
import "./BoostScreen.css";
import NavigationBar from "../../../navigationBar/NavigationBar.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import {useData} from "../../../DataContext.tsx";
import {BoostItem} from "./boostItem/BoostItem.tsx";
import IcCircle from "../../../../assets/ic_inco_circle.svg";
import IcBot from "../../../../assets/boost/ic_bot.svg";
import IcBatery from "../../../../assets/boost/ic_battery.svg";
import IcRocket from "../../../../assets/boost/ic_rocket.svg";
import IcTap from "../../../../assets/boost/ic_tap-hand.svg";
import {ModalBoostAbout} from "./modalBoostAbout/ModalBoostAbout.tsx";
import {ModalBoostItem} from "./modalBoostItem/ModalBoostItem.tsx";
import {BoostItem as boostestItems, updateLevel} from "../../../../core/dataWork/RemoteUtilsRequester.ts";
import {useToast} from "../../../viewComponents/toast/ToastContext.tsx";
import {formatNumberToK, useTelegramBackButton} from "../../../viewComponents/Utils.tsx";
import {PremiumDie} from "../../../viewComponents/premiumDie/PremiumDie.tsx";
import {PremiumModal} from "../../../viewComponents/premiumModal/PremiumModal.tsx";


export const BoostScreen: React.FC = () => {
    const navigate = useNavigate();
    const {dataApp, setDataApp} = useData();
    const {setTurboBoost} = useData()
    const {showToast} = useToast();

    try {
        useTelegramBackButton(true)
    } catch (e) {
        console.log("error in postEvent - ", e)
    }

    const handleShowToast = (message: string, type: 'success' | 'error' | 'info', endTime?: string, endWork?: () => void) => {
        showToast(message, type, endTime, endWork);
    };

    const getBoostImage = (boostName: string) => {
        switch (boostName) {
            case "tapBoot":
                return IcBot;
            case "energy limit":
                return IcBatery;
            case "turbo":
                return IcRocket;
            case "multitap":
                return IcTap;
            default:
                return IcTap;
        }
    };

    const getBoostDescription = (boostName: string): string => {
        switch (boostName) {
            case "tapBoot":
                return "Increase the amount of time that tapBoot will run after you exit the app, and bring you recurring revenue.";
            case "energy limit":
                return "Increase the limit of energy you spend with each tap";
            case "turbo":
                return "Turbo mode makes it possible not to waste energy and increases revenue per click twice";
            case "multitap":
                return "Increase the number of coins you can earn with each tap by taking advantage of this opportunity.";
            default:
                return "";
        }
    };

    const getBoostAbout = (boostName: string, level: number): string => {
        switch (boostName) {
            case "tapBoot":
                return `+5 min to work tab boot for level ${level}`;
            case "energy limit":
                return `+500 energy to limit for level ${level}`;
            case "turbo":
                return "Available 2 times a day";
            case "multitap":
                return `+1 coin for tap for level ${level}`;
            default:
                return "x2 your coins";
        }
    };

    useEffect(() => {
        console.log("dataApp - ", dataApp.coins);
        if (dataApp.userId == "") {
            handleNav("loading")
        }
    }, [dataApp]);


    const location = useLocation()
    const {openPremModal} = location.state as { openPremModal: boolean | null }

    useEffect(() => {
        if(openPremModal !=null) {
            if(openPremModal) {
                openModalPremium()
            }
        }
    }, [openPremModal]);

    const handleNav = (marsh: string) => {
        navigate(`/${marsh}`);
    };

    const updateLevelBoost = async () => {
        const boostId = selectedBottomSheetItem;
        if (boostId != undefined) {
            if (boostId.price < dataApp.coins) {
                const resultUpdate = await updateLevel(boostId.boostName);
                if (typeof resultUpdate === 'object') {
                    setDataApp(resultUpdate.user);
                    if (resultUpdate.boostEndTime != undefined) {
                        const endWork = () => {
                            setTurboBoost("");
                        };
                        handleShowToast("turbo boost is active", "success", resultUpdate.boostEndTime, endWork);
                        setTurboBoost(resultUpdate.boostEndTime);
                    } else {
                        handleShowToast("boost update level success", "success");
                    }
                } else {
                    handleShowToast("boost update level error", "error");
                }
                closeBottomSheet()
            } else {
                handleShowToast("You don't have enough coins", "error");
            }
        }
    };

    const [isBottomSheetVisibleAbout, setBottomSheetVisibleAbout] = useState(false);
    const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
    const [isModalPremiumVisible, setModalPremiumVisible] = useState(false);
    const [selectedBottomSheetItem, setSelectedBottomSheetItem] = useState<boostestItems | null>(null);

    const openBottomSheet = () => {
        setBottomSheetVisibleAbout(true);
    };

    const closeBottomSheet = () => {
        setBottomSheetVisibleAbout(false);
        setBottomSheetVisible(false);
        setModalPremiumVisible(false)
        setSelectedBottomSheetItem(null)
    };

    const openBottomSheetBoostItem = (item: boostestItems) => {
        setSelectedBottomSheetItem(item)
        setBottomSheetVisible(true)
    }

    const openModalPremium = () => {
        setModalPremiumVisible(true)
    }


    return (
        <div className="boost-container">
            <div className="boost-raspred-container">
                <p className="tx-h1-boots">Boost</p>

                <div className="info-boost-container" onClick={openBottomSheet}>
                    <p className="info-boost-tx">How a boost works</p>
                    <img src={IcCircle} className="info-boost-img" alt="Boost Info"/>
                </div>

                <div className="line-boost-information"/>

                <div className="premium-die-ovner-contaiener">
                    <PremiumDie onClick={openModalPremium}/>
                </div>

                <div className="boost-container-tx-inf">
                    <p className="tx-h2-boosts">Boosters</p>
                    <p className="tx-h3-boosts">
                        Enhance your tapping power for faster progress <br/>
                        and bigger rewards.
                    </p>
                </div>

                {dataApp.boosts?.map((boost, index) => (
                    <div key={index} className="boost-item-wrapper">
                        <BoostItem
                            name={boost.boostName}
                            price={formatNumberToK(boost.price)}
                            lvl={boost.level}
                            checkIcon={getBoostImage(boost.boostName)}
                            onClick={() => openBottomSheetBoostItem(boost)}
                            clickable={!(boost.level === 50)}
                            textAlertMessage={boost.boostName === "turbo" ? "Coming soon" : "Maximum level"}
                        />

                    </div>
                ))}
            </div>

            <NavigationBar
                initialSelected=""
                onEarnClick={() => handleNav("Tap")}
                onInviteClick={() => handleNav("friends")}
                onProfileClick={() => handleNav("profile")}
                onTasksClick={() => handleNav("tasks")}
            />

            <ModalBoostAbout title={"How a boost works"} isVisible={isBottomSheetVisibleAbout}
                             onClose={closeBottomSheet}/>
            {selectedBottomSheetItem != null && (
                <ModalBoostItem title={selectedBottomSheetItem.boostName}
                                description={getBoostDescription(selectedBottomSheetItem.boostName)}
                                about={getBoostAbout(selectedBottomSheetItem.boostName, selectedBottomSheetItem.level)}
                                lvl={selectedBottomSheetItem.level}
                                price={selectedBottomSheetItem.price}
                                image={getBoostImage(selectedBottomSheetItem.boostName)}
                                isVisible={isBottomSheetVisible} onClose={closeBottomSheet}
                                onBtnClick={updateLevelBoost}/>
            )}

            <PremiumModal isVisible={isModalPremiumVisible} onClose={closeBottomSheet} onBtnClick={() => {
            }}/>
        </div>
    );
};
