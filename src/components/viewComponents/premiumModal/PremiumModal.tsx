import React, {useEffect, useRef, useState} from "react";
import "./PremiumModal.css"
import PremiumIco from "../../../assets/ic_premium.svg";
import CloseIc from "../../../assets/ic_close.svg";
import CheckIc from "../../../assets/ic_check_round.svg";
import InfoIco from "../../../assets/ic_inco_circle.svg";
import PriceSelector from "./priceSelector/PriceSelector.tsx";

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


    const prices = [
        { name: '7 days', price: '$5' },
        { name: '14 days', price: '$14' },
        { name: '1 month', price: '$25' }
    ];

    const handleTabSelect = (selectedTab: { name: string; price: string }) => {
        console.log('Selected tab:', selectedTab);
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).classList.contains("modal-overlay-invite")) {
            onClose();
        }
    };

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

                <span className="tx-title-premium-modal">
                    Upgrade to Premium and enjoy a<br/>range of extra benefits:
                </span>

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
                <div style={{height:"16px"}}/>

                <PriceSelector tabs={prices} onTabSelect={handleTabSelect} />

                <div className="main-btn-action-to-upgrade">
                    <span className="main-tx-to-btn-action-to-upgrade">UPGRADE TO PREMIUM</span>
                </div>

            </div>
        </div>
    )
}