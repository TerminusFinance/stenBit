import React, {useState} from "react";
import "./BoostScreen.css";
import NavigationBar from "../../../navigationBar/NavigationBar.tsx";
import {useNavigate} from "react-router-dom";
import {useData} from "../../../DataContext.tsx";
import {BoostItem} from "./boostItem/BoostItem.tsx";
import IcCircle from "../../../../assets/ic_inco_circle.svg";
import IcBot from "../../../../assets/boost/ic_bot.svg";
import IcBatery from "../../../../assets/boost/ic_battery.svg";
import IcRocket from "../../../../assets/boost/ic_rocket.svg";
import IcTap from "../../../../assets/boost/ic_tap-hand.svg";
import {ModalBoostAbout} from "./modalBoostAbout/ModalBoostAbout.tsx";
import {ModalBoostItem} from "./modalBoostItem/ModalBoostItem.tsx";

export const BoostScreen: React.FC = () => {
    const navigate = useNavigate();
    const {dataApp} = useData();

    // Helper function to get boost image based on boostName
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
                return IcTap; // Handle if boostName doesn't match any case
        }
    };

    const handleNav = (marsh: string) => {
        navigate(`/${marsh}`);
    };

    const [isBottomSheetVisibleAbout, setBottomSheetVisibleAbout] = useState(false);
    const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);

    const openBottomSheet = () => {
        setBottomSheetVisibleAbout(true);
    };

    const closeBottomSheet = () => {
        setBottomSheetVisibleAbout(false);
        setBottomSheetVisible(false);
    };

    return (
        <div className="boost-container">
            <div className="boost-raspred-container">
                <p className="tx-h1-boots">Boost</p>

                <div className="info-boost-container" onClick={openBottomSheet}>
                    <p className="info-boost-tx">How a boost works</p>
                    <img src={IcCircle} className="info-boost-img" alt="Boost Info"/>
                </div>

                <div className="line-boost-information"/>

                <div className="boost-container-tx-inf">
                    <p className="tx-h2-boosts">Boosters</p>
                    <p className="tx-h3-boosts">
                        Enhance your tapping power for faster progress <br/>
                        and bigger rewards.
                    </p>
                </div>

                {dataApp.boosts?.map((boost, index) => (
                    <BoostItem
                        key={index} // Assuming boost object has a unique identifier
                        name={boost.boostName}
                        price={boost.price}
                        lvl={boost.level}
                        checkIcon={getBoostImage(boost.boostName)}
                    />
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
            <ModalBoostItem title={''} description={''} about={''} lvl={1} price={1} image={""}
                            isVisible={isBottomSheetVisible} onClose={closeBottomSheet} onBtnClick={() => {
            }}/>
        </div>
    );
};
