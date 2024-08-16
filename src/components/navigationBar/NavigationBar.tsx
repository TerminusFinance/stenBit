import React, { useState, useEffect } from 'react';
import './NavigationBar.css';
import ernIc from "../../assets/navBar/ic-earn.svg";
import ernIcSelect from "../../assets/navBar/ic-earn-select.svg";
import TaskIc from "../../assets/navBar/ic-task.svg";
import TaskIcSelect from "../../assets/navBar/ic-task-select.svg";
import InviteIc from "../../assets/navBar/ic-invite.svg";
import InviteIcSelect from "../../assets/navBar/ic-invite-select.svg";
import ProfileIc from "../../assets/navBar/ic-profile.svg";
import ProfileIcSelect from "../../assets/navBar/ic-prolife-select.svg";
import RatingIc from "../../assets/navBar/ic_rating.svg";
import RatingIcSelect from "../../assets/navBar/ic_rating_select.svg";

type NavigationBarProps = {
    initialSelected: string;
    onEarnClick: () => void;
    onTasksClick: () => void;
    onInviteClick: () => void;
    onProfileClick: () => void;
    onRatingClick: () => void;
};

const NavigationBar: React.FC<NavigationBarProps> = ({
                                                         initialSelected,
                                                         onEarnClick,
                                                         onTasksClick,
                                                         onInviteClick,
                                                         onProfileClick,
                                                         onRatingClick
                                                     }) => {
    const [selected, setSelected] = useState<string | null>(
        initialSelected.trim() !== "" ? initialSelected : null
    );

    useEffect(() => {
        setSelected(initialSelected.trim() !== "" ? initialSelected : null);
    }, [initialSelected]);

    return (
        <div className="nav-bar">
            <div
                className={`nav-item ${selected === 'Earn' ? 'selected' : ''}`}
                onClick={() => {
                    setSelected('Earn');
                    onEarnClick();
                }}
            >
                <div className="icon-text-wrapper">
                    <img
                        src={selected === 'Earn' ? ernIcSelect : ernIc}
                        alt="Earn"
                    />
                    <span>Earn</span>
                </div>
            </div>
            <div
                className={`nav-item ${selected === 'Tasks' ? 'selected' : ''}`}
                onClick={() => {
                    setSelected('Tasks');
                    onTasksClick();
                }}
            >
                <div className="icon-text-wrapper">
                    <img
                        src={selected === 'Tasks' ? TaskIcSelect : TaskIc}
                        alt="Tasks"
                    />
                    <span>Tasks</span>
                </div>
            </div>


            <div
                className={`nav-item ${selected === 'Rating' ? 'selected' : ''}`}
                onClick={() => {
                    setSelected('Rating');
                    onRatingClick();
                }}
            >
                <div className="icon-text-wrapper">
                    <img
                        src={selected === 'Rating' ? RatingIcSelect : RatingIc}
                        alt="Rating"
                    />
                    <span>Rating</span>
                </div>
            </div>

            <div
                className={`nav-item ${selected === 'Invite' ? 'selected' : ''}`}
                onClick={() => {
                    setSelected('Invite');
                    onInviteClick();
                }}
            >
                <div className="icon-text-wrapper">
                    <img
                        src={selected === 'Invite' ? InviteIcSelect : InviteIc}
                        alt="Invite"
                    />
                    <span>Invite</span>
                </div>
            </div>
            <div
                className={`nav-item ${selected === 'Profile' ? 'selected' : ''}`}
                onClick={() => {
                    setSelected('Profile');
                    onProfileClick();
                }}
            >
                <div className="icon-text-wrapper">
                    <img
                        src={selected === 'Profile' ? ProfileIcSelect : ProfileIc}
                        alt="Profile"
                    />
                    <span>Profile</span>
                </div>
            </div>

        </div>
    );
};

export default NavigationBar;
