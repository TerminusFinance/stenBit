import React from "react";
import "./SecondActionBtn.css";

interface MainActionBtnProps {
    txInBtn: string;
    onClick: () => void;
}

export const SecondActionBtn: React.FC<MainActionBtnProps> = ({txInBtn, onClick}) => {

    return (
        <div className="btn-second-action" onClick={onClick}>
            <p className="tx-btn-second-action">{txInBtn}</p>
        </div>

    )
}