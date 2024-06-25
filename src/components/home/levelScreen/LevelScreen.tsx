import React from "react";
import './LevelScreen.css';
import Slider from "./imageSlider/Slider.tsx";
import whiteLevel from "../../../assets/diamont/ic_white_level.png";
import oceanLevel from "../../../assets/diamont/ic_ocean_level.png";
import redLevel from "../../../assets/diamont/ic_red_level.png";
import purpleLevel from "../../../assets/diamont/ic_purple_level.png";
import { useData } from "../../DataContext.tsx";

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
    const { dataApp } = useData();

    if (dataApp.coins != null) {
        const slides: SlidesType[] = [
            {
                title: 'White Level',
                description: 'Your number of shares determines the league you enter',
                image: whiteLevel,
                currentProgress: 0,
                maxProgress: 5000,
            },
            {
                title: 'Ocean Level',
                description: 'Your number of shares determines the league you enter',
                image: oceanLevel,
                currentProgress: 0,
                maxProgress: 50000,
            },
            {
                title: 'Red Level',
                description: 'Your number of shares determines the league you enter',
                image: redLevel,
                currentProgress: 0,
                maxProgress: 150000,
            },
            {
                title: 'Purple Level',
                description: 'Your number of shares determines the league you enter',
                image: purpleLevel,
                currentProgress: 0,
                maxProgress: 500000,
            },
        ];

        let initialSlide = 0;
        let remainingCoins = dataApp.coins;

        for (let i = 0; i < slides.length; i++) {
            if (remainingCoins >= slides[i].maxProgress) {
                slides[i].currentProgress = slides[i].maxProgress;
                remainingCoins -= slides[i].maxProgress;
                initialSlide = i; // set the initialSlide to the highest level user qualifies for
            } else {
                slides[i].currentProgress = remainingCoins;
                break;
            }
        }

        return (
            <div className="level-container">
                <Slider itemList={slides} initialSlide={initialSlide} />
            </div>
        );
    }

    return null;
};

export default LevelScreen;
