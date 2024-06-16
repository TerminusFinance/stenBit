import React, { useRef, useState } from 'react';
import './Slider.css';
import bronze_cup from '../../../../assets/bronze_cup.png';
import silver_cup from '../../../../assets/silver_cup.png';
import gold_cup from '../../../../assets/gold_cup.png';
import ProgressBar from "../../progressBar/ProgressBar.tsx";
import leftArrow from "../../../../assets/ic_arrow_left.svg";
import rightArrow from "../../../../assets/ic_arrow_right.svg";

const slides = [
    {
        title: 'Bronz',
        description: 'Your number of shares determines the league you enter',
        image: bronze_cup,
        currentProgress: 500,
        maxProgress: 500
    },
    {
        title: 'Silver',
        description: 'Your number of shares determines the league you enter',
        image: silver_cup,
        currentProgress: 0,
        maxProgress: 5000
    },
    {
        title: 'Gold',
        description: 'Your number of shares determines the league you enter',
        image: gold_cup,
        currentProgress: 0,
        maxProgress: 500
    },
];

const Slider: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const nextSlide = () => {
        if (currentSlide < slides.length - 1 && !isAnimating) {
            setIsAnimating(true);
            console.log("currentSlide - ", currentSlide)
            setCurrentSlide(prevSlide => prevSlide + 1);
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0 && !isAnimating) {
            setIsAnimating(true);
            const newValue = currentSlide - 1
            console.log("currentSlide - ", currentSlide)
            console.log("newValue -", newValue)
            // setCurrentSlide(prevSlide => prevSlide - 1);
            setCurrentSlide(newValue);
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
        <div className="slider-container"
             onTouchStart={handleTouchStart}
             onTouchMove={handleTouchMove}
             onTouchEnd={handleTouchEnd}>
            <button
                className={`nav-button left ${currentSlide === 0 ? 'disabled' : ''}`}
                onClick={prevSlide}
                disabled={currentSlide === 0 || isAnimating}
            >
                <img src={leftArrow} alt="Previous"
                     className={`image-nav left ${currentSlide === 0 ? 'disabled' : ''}`}/>
            </button>

            <div className="slide-image-wrapper">
                <div className="slider-wrapper">
                    <div className="slides" style={{
                        transform: `translateX(-${currentSlide * 100}%)`,
                        transition: isAnimating ? 'transform 300ms ease-out' : 'none'
                    }} onTransitionEnd={handleTransitionEnd}>
                        {slides.map((slide, index) => (
                            <div key={index} className="slide">
                                <img src={slide.image} alt={slide.title} className="slide-image"/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <button
                className={`nav-button right ${currentSlide === slides.length - 1 ? 'disabled' : ''}`}
                onClick={nextSlide}
                disabled={currentSlide === slides.length - 1 || isAnimating}
            >
                <img src={rightArrow} alt="Next"
                     className={`image-nav right ${currentSlide === slides.length - 1 ? 'disabled' : ''}`}/>
            </button>
            <div style={{textAlign: 'center', width: '100%'}}>
                <h2>{slides[currentSlide].title}</h2>
                <p>{slides[currentSlide].description}</p>
                <div style={{width: '100%', paddingTop: 16}}>
                    {slides[currentSlide].currentProgress === 0 ? (
                        <ProgressBar progress={`From ${slides[currentSlide].maxProgress}`}/>
                    ) : (
                        <ProgressBar progress={{
                            current: slides[currentSlide].currentProgress,
                            max: slides[currentSlide].maxProgress
                        }}/>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Slider;
