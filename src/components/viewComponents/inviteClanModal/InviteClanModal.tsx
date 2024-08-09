import React, {useEffect, useRef, useState} from "react";
import PremiumIco from "../../../assets/ic_premium.svg";
import CloseIc from "../../../assets/ic_close.svg";
import {addMeToClan, Clan, getClanWitchClanId} from "../../../core/dataWork/RemoteUtilsRequester.ts";
import ProgressBar from "../progressBar/ProgressBar.tsx";
import "./InviteClanModal.css";
import {useToast} from "../toast/ToastContext.tsx";

interface ModalPremiumProps {
    isVisible: boolean;
    onClose: () => void;
    onBtnClick: () => void
    code: string;
}

export const InviteClanModal: React.FC<ModalPremiumProps> = ({isVisible, onClose, code}) => {
    const overlayRef = useRef<HTMLDivElement>(null);
    const sheetRef = useRef<HTMLDivElement>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [loading, setLoading] = useState(false);
    const [clanItem, setClanItem] = useState<Clan>()
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


    const GetClansOperations = async () => {
        if(code != "") {
            setLoading(true)
            const resultOperation = await getClanWitchClanId(code)
            if (typeof resultOperation == "object") {
                setClanItem(resultOperation)
            }
            setLoading(false)
        }
    }

    useEffect(() => {
        GetClansOperations()
    }, []);


    const handleOverlayClick = (e: React.MouseEvent) => {
        console.log("handleOverlayClick setups")
        if ((e.target as HTMLElement).classList.contains("modal-overlay-invite-clan")) {
            onClose();
        }
    };

    if (!isVisible && !isAnimating) return null;


    const JoinToClanHandler = async () => {
        setLoading(true)
        try {
            const result = await addMeToClan(code)
            if(typeof result === 'boolean') {
                if(result) {
                    onClose()
                    handleShowToast(`You have joined the clan ${clanItem?.clanName}`, "success")
                } else {
                    handleShowToast(`An error has occurred, please try again`, "error")
                }
            } else {
                handleShowToast(result, "error")
            }
            setLoading(false)
        } catch (e) {
            console.log("error - ", e)
        }
    }

    return (
        <div className="modal-overlay-invite-clan" ref={overlayRef} onClick={handleOverlayClick}>
            <div className="modal-invite-clan" ref={sheetRef}>


                <div className="div-btn-close">
                    <div className="container-premium-modal">
                        <img className="img-premium-modal" src={PremiumIco} alt="Invite"/>
                        <p className="tx-premium-modal">Invitation to the clan</p>
                    </div>
                    <img onClick={onClose} src={CloseIc} alt="Close"/>
                </div>

                <span className="tx-title-premium-modal">
                    You have been invited to the clan ${clanItem?.clanName}
                </span>

                <div style={{height: '32px'}}/>

                <div className="main-btn-action-to-upgrade" onClick={JoinToClanHandler}>
                    <span className="main-tx-to-btn-action-to-upgrade">JOIN A CLAN</span>
                </div>

            </div>

            {loading && <ProgressBar/>}
        </div>
    );
}