import React, {useEffect, useRef, useState} from "react";
import "./PremiumModal.css"
import PremiumIco from "../../../assets/ic_premium.svg";
import CloseIc from "../../../assets/ic_close.svg";
import CheckIc from "../../../assets/ic_check_round.svg";
import InfoIco from "../../../assets/ic_inco_circle.svg";
import PriceSelector from "./priceSelector/PriceSelector.tsx";
import {
    getListSubscriptionOptions, getPremiumUsers,
    subscribeToPremium,
    SubscriptionOptions
} from "../../../core/dataWork/RemoteUtilsRequester.ts";
import {initInvoice} from "@tma.js/sdk";
import {useData} from "../../DataContext.tsx";
import {calculateDaysDifference} from "../Utils.tsx";

interface ModalPremiumProps {
    isVisible: boolean;
    onClose: () => void;
    onBtnClick: () => void
}

const extraBenefits = [
    "2x Mining Speed", "Exclusive Coin Skin", "Gold Name in Leaderboard", "Gold Name in Leaderboard", "Support the Developers"
]

export const PremiumModal: React.FC<ModalPremiumProps> = ({isVisible, onClose}) => {

    const overlayRef = useRef<HTMLDivElement>(null);
    const sheetRef = useRef<HTMLDivElement>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [prices, setPrices] = useState<SubscriptionOptions[]>()
    const [selectedItem, setSelectedItem] = useState<SubscriptionOptions>()
    const invoice = initInvoice();
    const {dataApp, setDataApp} = useData();
    useEffect(() => {
        if (isVisible) {
            setIsAnimating(true);
            if (overlayRef.current && sheetRef.current) {
                overlayRef.current.classList.add("open");
                sheetRef.current.classList.add("open");
            }
        } else {
            if (overlayRef.current && sheetRef.current) {
                sheetRef.current.classList.remove("open");
                setTimeout(() => {
                    if (overlayRef.current) {
                        overlayRef.current.classList.remove("open");
                    }
                    setIsAnimating(false);
                }, 300); // Длительность анимации
            }
        }
    }, [isVisible]);


    useEffect(() => {
        const beber = async () => {

            const result = await getListSubscriptionOptions()
            if (typeof result == "object") {
                setPrices(result)
            }
        }
        beber()
    }, []);


    const handleTabSelect = (selectedTab: { name: string; price: number }) => {
        const item: SubscriptionOptions = {
            name: selectedTab.name,
            price: selectedTab.price
        };
        setSelectedItem(item);
        console.log('Selected tab:', selectedTab);
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).classList.contains("modal-overlay-invite")) {
            onClose();
        }
    };

    const onClickToBuy = async () => {
        if (selectedItem != undefined) {
            const result = await subscribeToPremium(selectedItem)
            console.log("resultToBuyPremka - ", result)
            if (typeof result == 'object') {
                if (result.ok) {
                    invoice
                        .open(result.result, 'url')
                        .then((status) => {
                            // Output: 'paid'
                            if (status == "paid") {
                                //Обработка успешной покупки подписки
                                ProcessingPaidResult()
                            }
                            return console.log(status);
                        });
                }
            }

        }
    }

    const ProcessingPaidResult = async () => {
        const paidResult = await getPremiumUsers()
        if(typeof paidResult == "object" ) {
            setDataApp(prevDataApp => ({
                ...prevDataApp,
                premium: paidResult
            }));
        }
        onClose()
    }


    if (!isVisible && !isAnimating) return null;
    return (
        <div className="modal-overlay-premium" ref={overlayRef} onClick={handleOverlayClick}>
            <div className="modal-premium" ref={sheetRef}>

                <div className="div-btn-close">
                    <div className="container-premium-modal">
                        <img className="img-premium-modal" src={PremiumIco} alt="Invite"/>
                        <p className="tx-premium-modal">Premium</p>
                    </div>
                    <img onClick={onClose} src={CloseIc} alt="Close"/>
                </div>

                <div className="bottom-sheet-content-task"></div>

                {dataApp.premium?.endDateOfWork != undefined && (
                    <div className="premium-day-off-container">
                        <span
                            className="premium-day-off-tx-h1">{calculateDaysDifference(dataApp.premium.endDateOfWork)}</span>
                        <span className="premium-day-off-tx-h2">Days before the end of the premium</span>
                    </div>
                )}


                {dataApp.premium?.endDateOfWork != undefined ? (
                    <span className="tx-title-premium-modal">
         Extend the premium version <br/>and continue to enjoy a number of additional benefits:
                </span>
                ) : (
                    <span className="tx-title-premium-modal">
                Upgrade to Premium and enjoy a<br/>range of extra benefits:
                </span>
                )}

                {extraBenefits.map((item) => (
                    <div style={{display: "flex", flexDirection: 'row', alignContent: "center", marginTop: "12px"}}>
                        <img src={CheckIc} className="ic-sub-item-premium-modal"/>
                        <span className="tx-sub-item-premium-modal">{item}</span>
                    </div>
                ))}

                <div style={{
                    flexDirection: "row",
                    display: "flex",
                    alignContent: "center",
                    marginTop: "24px",
                    justifyContent: "space-between"
                }}>
                    <span className="tx-select-plan">Select your plan</span>
                    <img src={InfoIco} style={{width: "24px", height: "24px"}}/>
                </div>
                <div style={{height: "16px"}}/>

                {prices != undefined ? (
                    <PriceSelector tabs={prices} onTabSelect={handleTabSelect}/>
                ) : (
                    <div>
                        <span>Not found</span>
                    </div>
                )}

                <div className="main-btn-action-to-upgrade" onClick={onClickToBuy}>
                    {dataApp.premium?.endDateOfWork != undefined ? (
                        <span className="main-tx-to-btn-action-to-upgrade">EXTEND THE PREMIUM</span>
                    ) : (
                        <span className="main-tx-to-btn-action-to-upgrade">UPGRADE TO PREMIUM</span>
                    )}

                </div>

            </div>
        </div>
    )
}