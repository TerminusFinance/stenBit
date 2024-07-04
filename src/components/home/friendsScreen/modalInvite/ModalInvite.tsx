import React, { useEffect, useRef, useState } from "react";
import "./ModalInvite.css";
import CloseIc from "../../../../assets/ic_close.svg";
import IcInvite from "../../../../assets/modal/ic_invite.svg";
import IcCopy from "../../../../assets/ic_copy.svg";
import { MainActionBtn } from "../../../buttons/mainActionBtn/MainActionBtn.tsx";
import IcSend from "../../../../assets/ic_send.svg";

interface ModalInviteProps {
    isVisible: boolean;
    onClose: () => void;
    userCodeInvite: string;
}

export const ModalInvite: React.FC<ModalInviteProps> = ({ isVisible, onClose, userCodeInvite }) => {
    const overlayRef = useRef<HTMLDivElement>(null);
    const sheetRef = useRef<HTMLDivElement>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const sendToTg = () => {
        // Implement Telegram send functionality
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
        if ((e.target as HTMLElement).classList.contains("modal-overlay-invite")) {
            onClose();
        }
    };

    if (!isVisible && !isAnimating) return null;

    return (
        <div className="modal-overlay-invite" ref={overlayRef} onClick={handleOverlayClick}>
            <div className="modal-invite" ref={sheetRef}>
                <div className="div-btn-close">
                    <div className="container-title-invite">
                        <img className="img-title-invite" src={IcInvite} alt="Invite" />
                        <p className="tx-title-invite">Invite Friends</p>
                    </div>
                    <img onClick={onClose} src={CloseIc} alt="Close" />
                </div>
                <div className="bottom-sheet-content">
                    <p className="tx-ref-link">Referral link</p>
                    <div className="copy-container">
                        <div className="text-container">
                            <span className="text-content">https://t.me/StenBitTestBot?start={userCodeInvite}</span>
                        </div>
                        <button className="copy-button" onClick={() => handleCopy(`https://t.me/StenBitTestBot?start=${userCodeInvite}`)}>
                            <img src={IcCopy} alt="Copy" />
                        </button>
                    </div>
                    <div className="btn-action-containe-modal-inviter">
                        <MainActionBtn imageSourse={IcSend} txInBtn={"Send Link"} onClick={sendToTg} />
                    </div>
                </div>
            </div>
        </div>
    );
};
