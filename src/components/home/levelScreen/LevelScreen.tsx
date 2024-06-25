import React from 'react';
import './LevelScreen.css';
import Slider from './imageSlider/Slider.tsx';
import { useLocation } from 'react-router-dom';
import {useData} from "../../DataContext.tsx";

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
    const location = useLocation();
    const { dataApp } = useData();
    const { levelTypes, currentLevel } = location.state;

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
                <Slider itemList={slides} initialSlide={initialSlide} />
            </div>
        );
    }

    return null;
};

export default LevelScreen;
