import React, { useRef, useState, useEffect } from 'react';
import './Slider.css';
import leftArrow from "../../../../assets/btn-nav-left.svg";
import rightArrow from "../../../../assets/btn-nav-right.svg";
import { SlidesTypeList } from "../LevelScreen.tsx";
import {ProgressBarLeagues} from "../../progressBar/progressBarLeagues/ProgressBarLeagues.tsx";

const Slider: React.FC<SlidesTypeList> = ({ itemList, initialSlide }) => {
    const [currentSlide, setCurrentSlide] = useState(initialSlide);
    const [isAnimating, setIsAnimating] = useState(false);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    useEffect(() => {
        setCurrentSlide(initialSlide);
    }, [initialSlide]);

    const nextSlide = () => {
        if (currentSlide < itemList.length - 1 && !isAnimating) {
            setIsAnimating(true);
            setCurrentSlide(prevSlide => prevSlide + 1);
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0 && !isAnimating) {
            setIsAnimating(true);
            setCurrentSlide(prevSlide => prevSlide - 1);
        }
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (touchStartX.current - touchEndX.current > 50) {
            nextSlide();
        } else if (touchEndX.current - touchStartX.current > 50) {
            prevSlide();
        }
    };

    const handleTransitionEnd = () => {
        setIsAnimating(false);
    };

    return (
        <div className="main-container-slider">
            <div className="slider-container"
                 onTouchStart={handleTouchStart}
                 onTouchMove={handleTouchMove}
                 onTouchEnd={handleTouchEnd}>

                <div className="slide-image-wrapper">
                    <div className="slider-wrapper">
                        <div className="slides" style={{
                            transform: `translateX(-${currentSlide * 100}%)`,
                            transition: isAnimating ? 'transform 300ms ease-out' : 'none'
                        }} onTransitionEnd={handleTransitionEnd}>
                            {itemList.map((slide, index) => (
                                <div key={index} className="slide">
                                    <div className={`image-container-slider-${slide.title}`}>
                                    <img src={slide.image} alt={slide.title} className="slide-image"/>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
            <div className="under-slider">
                <div className="btn-container">
                    <button
                        className={`nav-button left ${currentSlide === 0 ? 'disabled' : ''}`}
                        onClick={prevSlide}
                        disabled={currentSlide === 0 || isAnimating}
                    >
                        <img src={leftArrow} alt="Previous"
                             className={`image-nav left ${currentSlide === 0 ? 'disabled' : ''}`}/>
                    </button>

                    <h2>{itemList[currentSlide].title}</h2>

                    <button
                        className={`nav-button right ${currentSlide === itemList.length - 1 ? 'disabled' : ''}`}
                        onClick={nextSlide}
                        disabled={currentSlide === itemList.length - 1 || isAnimating}
                    >
                        <img src={rightArrow} alt="Next"
                             className={`image-nav right ${currentSlide === itemList.length - 1 ? 'disabled' : ''}`}/>
                    </button>
                </div>
                <div style={{width: '100%', paddingTop: 16, paddingLeft: 8, paddingRight: 8}}>
                    {itemList[currentSlide].currentProgress === 0 ? (
                        <ProgressBarLeagues progress={`From ${itemList[currentSlide].maxProgress}`} energy={{
                            current: 1253,
                            max: 2000
                        }} type={ itemList[currentSlide].title}/>
                    ) : (
                        <ProgressBarLeagues progress={{
                            current: itemList[currentSlide].currentProgress,
                            max: itemList[currentSlide].maxProgress
                        }} energy={{
                            current: 1253,
                            max: 2000
                        }} type={ itemList[currentSlide].title}/>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Slider;
