import React, {useEffect, useRef, useState} from 'react';
import './LevelScreen.css';
import Slider from './imageSlider/Slider.tsx';
import {useLocation, useNavigate} from 'react-router-dom';
import {useData} from "../../DataContext.tsx";
import NavigationBar from "../../navigationBar/NavigationBar.tsx";
import {OpenUrl, useTelegramBackButton} from "../../viewComponents/Utils.tsx";
import TaskSelector from "../tasksScreen/taskSelector/TaskSelector.tsx";
import ClanSlider, {ClanItem} from "./clanSlider/ClanSlider.tsx";
import {ModalInvite} from "../friendsScreen/modalInvite/ModalInvite.tsx";
import {RatingModal} from "../../viewComponents/ratingModal/RatingModal.tsx";
import {CreateClanModal} from "../../viewComponents/createClanModal/CreateClanModal.tsx";
import {ClanModal} from "../../viewComponents/clanModal/ClanModal.tsx";

export interface SlidesType {
    title: string;
    description: string;
    image: string;
    currentProgress: number;
    maxProgress: number;
    minProgress: number;
}

export interface SlidesTypeList {
    itemList: SlidesType[];
    initialSlide: number;
}

const LevelScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {dataApp} = useData();
    const {levelTypes, currentLevel} = location.state;
    const [tabSelected, setTabSelected] = useState<string>("User");
    useTelegramBackButton(true);
    const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
    const [isRatingBottomSheetVisible, setRatingBottomSheetVisible] = useState(false);
    const [isCreateClanBottomSheetVisible, setCreateClanBottomSheetVisible] = useState(false);
    const [isCLanModalVisible, setCLanModalVisible] = useState(false);
    const [inviteCode, setInviteCode] = useState<string>(""); // Состояние для хранения кода приглашения
    const [clanItem, setClanItem] = useState<ClanItem>()
    const startPos = location.state?.startPos ?? null;
    const [startap, setStartApp] = useState<string | null>()
    useEffect(() => {
        console.log("inviteCodeTap - ", startPos);
        if (startPos != undefined) {
            setStartApp(startPos)
        }
    }, [startPos]);

    const openBottomSheet = (param: string) => {
        setInviteCode(param); // Устанавливаем значение кода приглашения
        setBottomSheetVisible(true);
    };

    const openRatingBottomSheet = () => {
        setRatingBottomSheetVisible(true)
    }

    const openCreateClanBottomSheet = () => {
        setCreateClanBottomSheetVisible(true)
    }

    const openClanModal = (item: ClanItem) => {
        setClanItem(item)
        setCLanModalVisible(true)
    }

    const closeBottomSheet = () => {
        setBottomSheetVisible(false);
        setRatingBottomSheetVisible(false)
        setCreateClanBottomSheetVisible(false)
        setCLanModalVisible(false)
    };

    useEffect(() => {
        console.log("dataApp - ", dataApp.coins);
        if (dataApp.userId === "") {
            handleNav("loading");
        }
    }, [dataApp]);

    const handleNav = (marsh: string) => {
        navigate(`/${marsh}`);
    };


    const sliderRef = useRef<{ requestCheckedChanged: () => void }>(null);

    const handleButtonClick = () => {
        if (sliderRef.current) {
            sliderRef.current.requestCheckedChanged();
        }
    };

    if (levelTypes && currentLevel) {
        const slides: SlidesType[] = levelTypes.map((level: any, index: number) => {
            let currentProgress = 0;
            const coinsCurrent = dataApp.coins;
            const currentLevelIndex = levelTypes.indexOf(currentLevel);

            if (index < currentLevelIndex) {
                currentProgress = level.maxProgress;
            } else if (index === currentLevelIndex && coinsCurrent !== undefined) {
                currentProgress = Math.min(level.maxProgress, coinsCurrent);
            }
            console.log("level s -",level.title , "progress - ",currentProgress)
            return {
                ...level,
                currentProgress
            };
        });

        const initialSlide = levelTypes.indexOf(currentLevel);

        const handleTabSelect = (selectedTab: string) => {
            console.log(`Selected tab: ${selectedTab}`);
            setTabSelected(selectedTab);
        };

        const sendToTg = () => {
            const shareMessage = `t.me/TerminusCoinbot/Farm?startapp=${inviteCode}`
                + "\n"
                + "Play with me and my clan, get the opportunity to become a token holder through airdrop!\n"
            const telegramShareUrl = `https://t.me/share/url?url=&text=${encodeURIComponent(shareMessage)}`;
            OpenUrl(telegramShareUrl);
        };

        return (
            <div className="level-container">
                <div style={{
                    width: '100%',
                    marginLeft: '16px',
                    marginRight: '16px',
                    maxWidth: '95vw',
                    paddingTop: '16px'
                }}>
                    <TaskSelector
                        tabs={['User', 'Clan']}
                        onTabSelect={handleTabSelect}
                        firstSelectTab={startap != null ? startap : undefined}
                    />
                </div>

                <div className="sliders-wrapper">
                    {tabSelected === "User" ? (
                        <Slider itemList={slides} initialSlide={initialSlide}/>
                    ) : (
                        <ClanSlider ref={sliderRef} itemList={slides} onSendHandler={openBottomSheet}
                                    onOpenClanRatingHandler={openRatingBottomSheet}
                                    openCreateClanBottomSheet={openCreateClanBottomSheet}
                                    openClanModel={openClanModal}/>
                    )}
                </div>
                <NavigationBar
                    initialSelected=""
                    onEarnClick={() => handleNav("Tap")}
                    onInviteClick={() => handleNav("friends")}
                    onProfileClick={() => handleNav("profile")}
                    onTasksClick={() => handleNav("tasks")}
                    onRatingClick={() => handleNav("userLeagues")}
                />
                <ModalInvite
                    isVisible={isBottomSheetVisible}
                    onClose={closeBottomSheet}
                    userCodeInvite={inviteCode} // Передаем код приглашения в ModalInvite
                    sendToTg={sendToTg}
                />

                <RatingModal isVisible={isRatingBottomSheetVisible} onClose={closeBottomSheet}
                             onBtnClick={handleButtonClick}/>

                <CreateClanModal isVisible={isCreateClanBottomSheetVisible} onClose={closeBottomSheet}
                                 onBtnClick={handleButtonClick}/>
                <ClanModal isVisible={isCLanModalVisible} onClose={closeBottomSheet} onBtnClick={handleButtonClick}
                           name={clanItem?.name ? clanItem.name : ''}
                           description={clanItem?.description ? clanItem.description : ''}
                           urlChanel={clanItem?.urlChanel ? clanItem.urlChanel : ''}/>
            </div>
        );
    }

    return null;
};

export default LevelScreen;
