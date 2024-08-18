import React, {useEffect, useRef, useState} from "react";
import CloseIc from "../../../assets/ic_close.svg";
import "./ModalAbout.css"

interface ModalAboutProps {
    isVisible: boolean;
    onClose: () => void;
    title: string;
    descriptions: string;
}

export const ModalAbout: React.FC<ModalAboutProps> = ({ isVisible, onClose, title, descriptions }) => {
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
        if ((e.target as HTMLElement).classList.contains("modal-overlay-task")) {
            onClose();
        }
    };

    if (!isVisible && !isAnimating) return null;

    return (
        <div className="modal-overlay-task" ref={overlayRef} onClick={handleOverlayClick}>
            <div className="modal-task" ref={sheetRef}>

                <div className="div-btn-close">
                    <div className="container-title-task">
                        <p className="tx-title-task">{title}</p>
                    </div>
                    <img onClick={onClose} src={CloseIc} alt="Close"/>
                </div>

                <div className="bottom-sheet-content-task">
                    <p className="tx-description">
                        {descriptions}
                    </p>
                </div>
            </div>
        </div>
    )
}