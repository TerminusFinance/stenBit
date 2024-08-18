import React, {useEffect, useRef, useState} from "react";
import {
    boosClanLevels,
    getListSubscriptionOptionsClanUpgrateRunks,
    SubscriptionOptions
} from "../../../core/dataWork/RemoteUtilsRequester.ts";
import PremiumIco from "../../../assets/ic_premium.svg";
import CloseIc from "../../../assets/ic_close.svg";
import PriceSelector from "../premiumModal/priceSelector/PriceSelector.tsx";
import ProgressBar from "../progressBar/ProgressBar.tsx";
import "./RatingModal.css";
import {initInvoice} from "@telegram-apps/sdk";
import IcoStars from "../../../assets/ic_stars.svg";

interface ModalRatingProps {
    isVisible: boolean;
    onClose: () => void;
    onBtnClick: () => void
}

export const RatingModal: React.FC<ModalRatingProps> = ({isVisible, onClose, onBtnClick}) => {

    const overlayRef = useRef<HTMLDivElement>(null);
    const sheetRef = useRef<HTMLDivElement>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [prices, setPrices] = useState<SubscriptionOptions[]>()
    const [selectedItem, setSelectedItem] = useState<SubscriptionOptions>()
    const invoice = initInvoice();
    const [loading, setLoading] = useState(false);
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

            const result = await getListSubscriptionOptionsClanUpgrateRunks()
            if (typeof result == "object") {
                setPrices(result)
                setSelectedItem(result[0])
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
        if ((e.target as HTMLElement).classList.contains("modal-overlay-rating")) {
            onClose();
        }
    };

    const onClickToBuy = async () => {
        if (selectedItem != undefined) {
            const result = await boosClanLevels(selectedItem)
            console.log("resultToBuyPremka - ", result)
            if (typeof result == 'object') {
                if (result.ok) {
                    invoice
                        .open(result.result, 'url')
                        .then((status) => {
                            // Output: 'paid'
                            if (status == "paid") {
                                setLoading(true)
                                //Обработка успешной покупки подписки
                                onBtnClick()
                                setLoading(false)
                                onClose()
                            }
                            return console.log(status);
                        });
                }
            }

        }
    }


    if (!isVisible && !isAnimating) return null;

    return (
        <div className="modal-overlay-rating" ref={overlayRef} onClick={handleOverlayClick}>
            <div className="modal-rating" ref={sheetRef}>

                <div className="div-btn-close">
                    <div className="container-rating-modal">
                        <img className="img-premium-modal" src={PremiumIco} alt="Invite"/>
                        <p className="tx-premium-modal">Boost Clan Rank</p>
                    </div>
                    <img onClick={onClose} src={CloseIc} alt="Close"/>
                </div>

                <div className="bottom-sheet-content-task"></div>

                <span className="tx-title-premium-modal">
                Promote your clan to the top of the ranking
                </span>

                <div style={{height: "16px"}}/>

                {prices != undefined ? (
                    <PriceSelector tabs={prices} onTabSelect={handleTabSelect} icoCoin={IcoStars}/>
                ) : (
                    <div>
                        <span>Not found</span>
                    </div>
                )}

                <div className="main-btn-action-to-upgrade" onClick={onClickToBuy}>
                    <span className="main-tx-to-btn-action-to-upgrade">UPGRADE CLAN RATING</span>
                </div>

            </div>
            {loading && <ProgressBar/>}
        </div>
    )
}