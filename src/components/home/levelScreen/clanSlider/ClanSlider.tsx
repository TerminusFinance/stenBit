import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import './ClanSlider.css';
import leftArrow from "../../../../assets/btn-nav-left.svg";
import rightArrow from "../../../../assets/btn-nav-right.svg";
import { SlidesType } from "../LevelScreen.tsx";
import { ProgressBarLeagues } from "../../progressBar/progressBarLeagues/ProgressBarLeagues.tsx";
import {
    Level,
    getClansByLeagueLevels, ResultionClanResponse, ResultionGetClanById, getClanByUserId
} from "../../../../core/dataWork/RemoteUtilsRequester.ts";
import { ItemFriends } from "../../friendsScreen/itemFriends/ItemFriends.tsx";
import IcInvite from "../../../../assets/ic_send.svg";
import ProgressBar from "../../../viewComponents/progressBar/ProgressBar.tsx";
import { delay } from "ton/dist/utils/time";

interface CLanSliderTypeList {
    itemList: SlidesType[];
    onSendHandler: (param: string) => void;
    onOpenClanRatingHandler: () => void;
    openCreateClanBottomSheet: (onSuccess: () => void) => void;
}

export interface ClanSliderHandle {
    requestCheckedChanged: () => void;
}

const ClanSlider = forwardRef<ClanSliderHandle, CLanSliderTypeList>(({
                                                                         itemList,
                                                                         onSendHandler,
                                                                         onOpenClanRatingHandler,
                                                                         openCreateClanBottomSheet,
                                                                     }, ref) => {

    const [currentSlide, setCurrentSlide] = useState(0); // Начальный слайд по умолчанию 0
    const [isAnimating, setIsAnimating] = useState(false);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);
    const [users, setUsers] = useState<ResultionClanResponse>([]);
    const [userClan, setUserClan] = useState<ResultionGetClanById | null>(null);
    const [loading, setLoading] = useState(false);
    const hasFetchedData = useRef(false);

    useImperativeHandle(ref, () => ({ requestCheckedChanged }));

    const requestCheckedChanged = async () => {
        setLoading(true);
        await delay(2000);
        await RequestToServerToGetUsersLeagueList();
    };

    const RequestToServerToGetUsersLeagueList = async () => {
        setLoading(true);
        const newLevels: Level[] = itemList.map(item => ({
            minProgress: item.minProgress,
            maxProgress: item.maxProgress
        }));

        try {
            const userClanResult = await getClanByUserId();
            if (typeof userClanResult === "object") {
                setUserClan(userClanResult);
            } else {
                console.log("resultuserClanResult - ", userClanResult);
            }
            const getResult = await getClansByLeagueLevels(newLevels);
            console.log("getResult clans - ", getResult);
            if (typeof getResult === "object") {
                const sortedUsers: ResultionClanResponse = {};
                Object.keys(getResult).forEach(key => {
                    sortedUsers[Number(key)] = getResult[Number(key)].sort((a, b) => b.rating - a.rating);
                });
                setUsers(sortedUsers);
            } else {
                console.error("Error in request:", getResult);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    // Определяем начальный слайд на основе userClan
    useEffect(() => {
        if (userClan && userClan.clan) {
            const { rating } = userClan.clan;
            for (let i = 0; i < itemList.length; i++) {
                if (rating >= itemList[i].minProgress && rating <= itemList[i].maxProgress) {
                    setCurrentSlide(i);
                    break;
                }
            }
        }
    }, [userClan, itemList]);

    useEffect(() => {
        if (!hasFetchedData.current) {
            setLoading(true);
            RequestToServerToGetUsersLeagueList().finally(() => {
                setLoading(false);
                hasFetchedData.current = true;
            });
        }
    }, []);

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

    const calculateProgress = () => {
        const usersInCurrentSlide = users[currentSlide];
        if (!usersInCurrentSlide) return { current: 0, max: itemList[currentSlide].maxProgress };

        let totalRating = usersInCurrentSlide.reduce((sum, user) => sum + user.rating, 0);
        let maxProgress = 0;

        for (let i = 0; i < itemList.length; i++) {
            maxProgress = itemList[i].maxProgress;
            if (totalRating <= maxProgress) {
                return {
                    current: totalRating,
                    max: maxProgress
                };
            }
            totalRating -= maxProgress;
        }

        return { current: maxProgress, max: maxProgress }; // Если превышает все уровни
    };

    const { current, max } = calculateProgress();

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
                                    <div className="image-container-slider">
                                        <img src={slide.image} alt={slide.title} className="slide-image" />
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
                        <img src={leftArrow} alt="Previous" className="image-nav"/>
                    </button>

                    <h2 className="slider-title">{itemList[currentSlide].title}</h2>

                    <button
                        className={`nav-button right ${currentSlide === itemList.length - 1 ? 'disabled' : ''}`}
                        onClick={nextSlide}
                        disabled={currentSlide === itemList.length - 1 || isAnimating}
                    >
                        <img src={rightArrow} alt="Next" className="image-nav"/>
                    </button>
                </div>
                <div
                    style={{width: '100%', paddingTop: 16, paddingLeft: 12, paddingRight: 12, boxSizing: 'border-box'}}>
                    {current === 0 ? (
                        <ProgressBarLeagues progress={`From ${max}`} energy={{
                            current: 1253,
                            max: 2000
                        }} type={itemList[currentSlide].title}/>
                    ) : (
                        <ProgressBarLeagues progress={{
                            current: current,
                            max: max
                        }} energy={{
                            current: 1253,
                            max: 2000
                        }} type={itemList[currentSlide].title}/>
                    )}
                </div>
            </div>

            {users[currentSlide] && users[currentSlide].map((user, index) => (
                <div key={index} className="user-container">
                    <ItemFriends
                        userName={user.clanName}
                        coinsReferral={`${user.rating}`}
                        position={index + 1}
                        selected={!!(userClan?.clan && user.clanName === userClan.clan.clanName)}
                    />
                </div>
            ))}


            <div style={{marginLeft: '16px', marginRight: '16px'}}>
                {userClan?.clan != undefined ? (
                    <div className="container-clan-up-btn">
                        <div className="main-btn-action-to-upgrade-clan" onClick={onOpenClanRatingHandler}>
                            <span className="main-tx-to-btn-action-to-upgrade">Upgrade your clan rating</span>
                        </div>
                        <div className="btn-clan-share" onClick={() => onSendHandler(userClan?.clan.clanId)}>
                            <img src={IcInvite} alt="Invite Icon" />
                        </div>
                    </div>
                ) : (
                    <div className="container-clan-up-btn">
                        <div className="main-btn-action-to-upgrade-clan"
                             onClick={() => openCreateClanBottomSheet(requestCheckedChanged)}>
                            <span className="main-tx-to-btn-action-to-upgrade">Create your clan</span>
                        </div>
                    </div>
                )}
            </div>

            {loading && <ProgressBar/>}
        </div>
    );
});

export default ClanSlider;