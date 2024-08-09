import React, { useEffect, useRef, useState } from "react";
import PremiumIco from "../../../assets/ic_premium.svg";
import CloseIc from "../../../assets/ic_close.svg";
import ProgressBar from "../progressBar/ProgressBar.tsx";
import "./CreateClanModal.css";
import IcCoins from "../../../assets/ic_dollar.svg";
import {createClan} from "../../../core/dataWork/RemoteUtilsRequester.ts";
import {useToast} from "../toast/ToastContext.tsx";

interface ModalCreateClanProps {
    isVisible: boolean;
    onClose: () => void;
    onBtnClick: () => void
}

export const CreateClanModal: React.FC<ModalCreateClanProps> = ({ isVisible, onClose, onBtnClick }) => {

    const overlayRef = useRef<HTMLDivElement>(null);
    const sheetRef = useRef<HTMLDivElement>(null);
    const nameInputRef = useRef<HTMLInputElement>(null);
    const descriptionInputRef = useRef<HTMLTextAreaElement>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [loading, setLoading] = useState(false);
    const [clanName, setClanName] = useState("");
    const [clanDescription, setClanDescription] = useState("");
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
        if ((e.target as HTMLElement).classList.contains("modal-overlay-rating")) {
            onClose();
        }
    };

    const handleNameKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            descriptionInputRef.current?.focus();
        }
    };

    const handleDescriptionKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter") {
            // You can add functionality here, e.g., submit the form
        }
    };

    const setUpCreate =async () => {
        setLoading(true);
        if(clanName != "" && clanDescription != "") {
            const result = await createClan(clanName, clanDescription)
            if(result == "Clan created successfully") {
                onBtnClick()
                onClose()
                handleShowToast("Successfully! Congratulations on the creation of your clan", "success")
            } else {
                handleShowToast(result, "error")
            }
        } else  {
            handleShowToast("All fields must be filled in", "error")
        }
        setLoading(false);
    };

    if (!isVisible && !isAnimating) return null;

    return (
        <div className="modal-overlay-rating" ref={overlayRef} onClick={handleOverlayClick}>
            <div className="modal-rating" ref={sheetRef}>
                <div className="div-btn-close">
                    <div className="container-rating-modal">
                        <img className="img-premium-modal" src={PremiumIco} alt="Invite"/>
                        <p className="tx-premium-modal">Create Your Clan</p>
                    </div>
                    <img onClick={onClose} src={CloseIc} alt="Close"/>
                </div>

                <div className="bottom-sheet-content-task">
                    <input
                        type="text"
                        className="input-field"
                        placeholder="Clan Name"
                        ref={nameInputRef}
                        value={clanName}
                        onChange={(e) => setClanName(e.target.value)}
                        onKeyPress={handleNameKeyPress}
                    />
                    <textarea
                        className="textarea-field"
                        placeholder="Clan Description"
                        ref={descriptionInputRef}
                        value={clanDescription}
                        onChange={(e) => setClanDescription(e.target.value)}
                        onKeyPress={handleDescriptionKeyPress}
                    />
                </div>

                <div className="reward-container-task-modal-boost">
                    <div className="coins-boost-t-container">
                        <img src={IcCoins} className="ic-reward-container-coins"/>
                        <p className="tx-reward-container-coins">-250K</p>
                    </div>
                    <p className="lvl-item-boost">Creating a clan</p>
                </div>

                <div className="main-btn-action-to-upgrade" onClick={setUpCreate}>
                    <span className="main-tx-to-btn-action-to-upgrade">Create Clan</span>
                </div>
            </div>
            {loading && <ProgressBar/>}
        </div>
    );
};
