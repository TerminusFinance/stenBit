import React, {useEffect, useRef, useState} from "react";
import CloseIc from "../../../../../assets/ic_close.svg";
import "./ModalBoostAbout.css"

interface ModalBoostAboutProps {
    isVisible: boolean;
    onClose: () => void;
    title: string;
}

export const ModalBoostAbout: React.FC<ModalBoostAboutProps> = ({ isVisible, onClose, title }) => {
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
                        Boosts are powerful tools in gaming that amplify your abilities, allowing you to achieve more in less time. In clicker games like those on Telegram, boosts typically enhance your tapping efficiency or increase the rewards you earn per action.

                        When activated, a boost optimizes your tapping power, often by multiplying the coins you collect per tap or reducing the time needed to achieve certain goals. This temporary surge in performance empowers players to progress faster through levels, earn more rewards, and reach higher scores.
                        Boosts can vary in duration and effect, offering short-term advantages that players strategically use to overcome challenges or accelerate their gameplay. Whether it's doubling your tapping speed or tripling your coin earnings for a limited time, boosts add excitement and strategic depth to the gaming experience.

                        In essence, mastering the use of boosts is key to maximizing your efficiency and achieving peak performance in clicker games, making them essential tools for ambitious players aiming to climb leaderboards and surpass their own limits.
                    </p>
                </div>
            </div>
        </div>
    )
}