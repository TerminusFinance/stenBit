import React, {useEffect, useRef, useState} from "react";
import CloseIc from "../../../../../assets/ic_close.svg";
import "./ModalBoostItem.css"
import IcCoins from "../../../../../assets/ic_dollar.svg";
import {MainActionBtn} from "../../../../buttons/mainActionBtn/MainActionBtn.tsx";
import {formatNumberToK} from "../../../../viewComponents/Utils.tsx";

interface ModalBoostItemProps {
    isVisible: boolean;
    onClose: () => void;
    title: string;
    description: string;
    about: string;
    image: string;
    price: number;
    lvl: number;
    onBtnClick: () => void
}

export const ModalBoostItem: React.FC<ModalBoostItemProps> = ({isVisible, onClose, title, description, about, image, price, lvl, onBtnClick}) => {
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


    const handleOverlayClick = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).classList.contains("modal-overlay-boost")) {
            onClose();
        }
    };

    if (!isVisible && !isAnimating) return null;

    return (
        <div className="modal-overlay-boost" ref={overlayRef} onClick={handleOverlayClick}>
            <div className="modal-boost" ref={sheetRef}>

                <div className="div-btn-close">
                    <div className="container-title-task">
                        <img className="img-title-task" src={image} alt="Invite"/>
                        <p className="tx-title-task">{title}</p>
                    </div>
                    <img onClick={onClose} src={CloseIc} alt="Close"/>
                </div>

                <div className="bottom-sheet-content-task">
                    <div className="reward-container-task-modal-boost">
                        <div className="coins-boost-t-container">
                            <img src={IcCoins} className="ic-reward-container-coins"/>
                            <p className="tx-reward-container-coins">+ {formatNumberToK(price)}</p>
                        </div>
                        <p className="lvl-item-boost">{lvl}lvl</p>
                    </div>
                    <div className="about-container-task-modal-boost">
                        <p className="about-tx-task-modal-boost">{about}</p>
                    </div>

                    <p className="tx-description-boost">
                        {description}
                    </p>

                    <MainActionBtn txInBtn={"Go ahead"} onClick={onBtnClick}/>
                </div>
            </div>
        </div>
    );
}