import React, {useEffect} from 'react';
import './LevelScreen.css';
import Slider from './imageSlider/Slider.tsx';
import {useLocation, useNavigate} from 'react-router-dom';
import {useData} from "../../DataContext.tsx";
import NavigationBar from "../../navigationBar/NavigationBar.tsx";
import {postEvent} from "@tma.js/sdk";

export interface SlidesType {
    title: string;
    description: string;
    image: string;
    currentProgress: number;
    maxProgress: number;
}

export interface SlidesTypeList {
    itemList: SlidesType[];
    initialSlide: number;
}

const LevelScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { dataApp } = useData();
    const { levelTypes, currentLevel } = location.state;

    try {
        postEvent('web_app_setup_back_button', { is_visible: true });
    } catch (e ) {
        console.log("error in postEvent - ", e)
    }

    useEffect(() => {
        console.log("dataApp - ", dataApp.coins);
        if(dataApp.userId == "") {
            handleNav("loading")
        }
    }, [dataApp]);

    const handleNav = (marsh: string) => {
        navigate(`/${marsh}`);
    };

    if (levelTypes && currentLevel) {
        const slides: SlidesType[] = levelTypes.map((level: any, index: number) => {
            let currentProgress = 0;
            const coinsCurrent = dataApp.coins
            if (index < levelTypes.indexOf(currentLevel)) {
                currentProgress = level.maxProgress;
            } else if (index === levelTypes.indexOf(currentLevel) && coinsCurrent != undefined) {
                // currentProgress = Math.min(currentLevel.maxProgress, currentLevel.currentProgress);
                currentProgress = coinsCurrent
            }
            return {
                ...level,
                currentProgress
            };
        });

        const initialSlide = levelTypes.indexOf(currentLevel);

        return (
            <div className="level-container">
                <div></div>
                <Slider itemList={slides} initialSlide={initialSlide} />

                <NavigationBar
                    initialSelected=""
                    onEarnClick={() => handleNav("Tap")}
                    onInviteClick={() => handleNav("friends")}
                    onProfileClick={() => handleNav("profile")}
                    onTasksClick={() => handleNav("tasks")}
                />

            </div>
        );
    }

    return null;
};

export default LevelScreen;
