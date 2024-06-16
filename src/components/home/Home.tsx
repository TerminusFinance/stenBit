import React from 'react';
import {NavLink, Outlet, } from 'react-router-dom';
import ic_tap from '../../assets/tap_ico.png';
import ic_telegram from '../../assets/boost_ico.png';
import ic_profile from '../../assets/profile_ico.png';
import ic_tasks from "../../assets/tasks_ico.png";
import './HomeScreen.css';

const HomeScreen: React.FC = () => {


    return (
        <div className="main-container">
            <div className="content">
                <Outlet />
            </div>
            <div className="bottom-nav">
                <NavLink
                    to={{
                        pathname: "/home/tap"
                    }}
                    className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                    <img src={ic_tap} alt="Tap" />
                    <span>Tap</span>
                </NavLink>
                <NavLink
                    to="/home/friends"
                    className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                    <img src={ic_telegram} alt="Friends" />
                    <span>Friends</span>
                </NavLink>
                <NavLink
                    to="/home/tasks"
                    className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                    <img src={ic_tasks} alt="Tasks" />
                    <span>Tasks</span>
                </NavLink>
                <NavLink
                    to="/home/profile"
                    className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                    <img src={ic_profile} alt="Profile" />
                    <span>Profile</span>
                </NavLink>
            </div>
        </div>
    );
};

export default HomeScreen;