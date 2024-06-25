import React, {useEffect, useRef} from 'react';
import './BottomSheetTask.css';
import CloseIc from '../../../../assets/ic_close.svg';
interface BottomSheetTaskProps {
    isVisible: boolean;
    onClose: () => void;
    image: string
    title: string;
    content: React.ReactNode;
}

const BottomSheetTask: React.FC<BottomSheetTaskProps> = ({isVisible, onClose, image, title, content}) => {
    const sheetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isVisible) {
            if (sheetRef.current) {
                sheetRef.current.classList.add('open');
            }
        } else {
            if (sheetRef.current) {
                sheetRef.current.classList.remove('open');
            }
        }
    }, [isVisible]);

    const handleOverlayClick = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).classList.contains('bottom-sheet-overlay')) {
            onClose();
        }
    };

    if (!isVisible) return null;

    return (
        <div className="bottom-sheet-overlay" onClick={handleOverlayClick}>
            <div className="bottom-sheet" ref={sheetRef}>
                <div className="div-btn-close">
                    <img onClick={onClose} src={CloseIc}/>
                </div>
                <div className="bottom-sheet-header">
                    <img src={image} className="img-view-task"/>
                    <h2>{title}</h2>
                </div>
                <div className="bottom-sheet-content">
                    {content}
                </div>
            </div>
        </div>
    );

};

export default BottomSheetTask;
