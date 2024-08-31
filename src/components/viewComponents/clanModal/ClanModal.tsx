import React, {useEffect, useRef, useState} from "react";
import PremiumIco from "../../../assets/ic_premium.svg";
import CloseIc from "../../../assets/ic_close.svg";
import "./ClanModal.css";
import IcCopy from "../../../assets/ic_copy.svg";
import {handleCopy} from "../Utils.tsx";
import {useToast} from "../toast/ToastContext.tsx";

interface ModalClanProps {
    isVisible: boolean;
    onClose: () => void;
    onBtnClick: () => void;
    name: string;
    description: string;
    urlChanel: string| null;
}

export const ClanModal: React.FC<ModalClanProps> = ({ isVisible, onClose , name, description, urlChanel}) => {
    const overlayRef = useRef<HTMLDivElement>(null);
    const sheetRef = useRef<HTMLDivElement>(null);
    const [isAnimating, setIsAnimating] = useState(false);


    const {showToast} = useToast();
    const handleShowToast = (message: string, type: 'success' | 'error' | 'info') => {
        showToast(message, type);
    };

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

    const handleOverlayClick = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).classList.contains("modal-overlay-clan")) {
            onClose();
        }
    };

    if (!isVisible && !isAnimating) return null;
    return (
        <div className="modal-overlay-clan" ref={overlayRef} onClick={handleOverlayClick}>
            <div className="modal-clan" ref={sheetRef}>

                <div className="div-btn-close">
                    <div className="container-rating-modal">
                        <img className="img-premium-modal" src={PremiumIco} alt="Invite"/>
                        <p className="tx-premium-modal">{name}</p>
                    </div>
                    <img onClick={onClose} src={CloseIc} alt="Close"/>
                </div>

                <p className="tx-description">{description}</p>

                {urlChanel && (


                    <div className="copy-container">
                        <div className="text-container">
                            <span className="text-content">{urlChanel}</span>
                        </div>
                        <button className="copy-button" onClick={() => {
                            handleCopy(urlChanel)
                            handleShowToast("Link copied", 'success')
                        }
                        }>
                            <img src={IcCopy} alt="Copy"/>
                        </button>
                    </div>
                )}


            </div>
        </div>
    )

}