import React from "react";
import "./MainActionBtn.css";

interface MainActionBtnProps {
    imageSourse: string;
    txInBtn: string;
    onClick: () => void;
}

export const MainActionBtn: React.FC<MainActionBtnProps> = ({imageSourse, txInBtn, onClick}) => {

    return (
        <div className="btn-invite-friends" onClick={onClick}>
            <img className="img-btn-invite-friends" src={imageSourse} alt="Invite"/>
            <p className="tx-btn-invite-friends">{txInBtn}</p>
        </div>

    )
}