import React, {useEffect, useRef, useState} from "react";
import {ItemFriends} from "../friendsScreen/itemFriends/ItemFriends.tsx";
import {
    getAllUsersLeague,
    getUsersLeague,

    UserLeague
} from "../../../core/dataWork/RemoteUtilsRequester.ts";
import NavigationBar from "../../navigationBar/NavigationBar.tsx";
import {useNavigate} from "react-router-dom";
import ProgressBar from "../../viewComponents/progressBar/ProgressBar.tsx";
import "./UserLeagueScreen.css";
import UserLeagueUpRatingModal from "../../viewComponents/userLeagueUpRatingModal/UserLeagueUpRatingModal.tsx";
import IcCoinsRating from "../../../assets/ic_rating-coin.svg";
import {formatNumberToK, useTelegramBackButton} from "../../viewComponents/Utils.tsx";
import TonIc from "../../../assets/ton-log-vec.svg";
import icIncoCircle from "../../../assets/ic_inco_circle.svg";
import {ModalAbout} from "../../viewComponents/modalAbout/ModalAbout.tsx";

const UserLeagueScreen: React.FC = () => {

    const navigate = useNavigate();
    const [usersList, setusersList] = useState<UserLeague[]>([]);
    const [users, setUsers] = useState<UserLeague>();
    const hasFetchedData = useRef(false);
    const [loading, setLoading] = useState(false);
    const [secondPlace, setSecondPlace] = useState<UserLeague>();
    const [firstPlace, setFirstPlace] = useState<UserLeague>();
    const [thirdPlace, setThirdPlace] = useState<UserLeague>();
    const [isRatingBottomSheetVisible, setRatingBottomSheetVisible] = useState(false);
    const [isBottomSheetVisibleAbout, setBottomSheetVisibleAbout] = useState(false);

    try {
        useTelegramBackButton(true)
    } catch (e) {
        console.log("error in postEvent - ", e)
    }


    const closeBottomSheet = () => {
        setRatingBottomSheetVisible(false)
        setBottomSheetVisibleAbout(false)
    };

    const ProcessingPaidResult = async () => {
        setLoading(true);
        const checkAndUpdate = async () => {
            const paidResult = await getUsersLeague();
            const currentUsers = users
            if (typeof paidResult === "object" && paidResult !== null && currentUsers != null) {
                const {userId, score} = paidResult;

                if (userId == currentUsers.userId && score > currentUsers.score) {
                    await requestToServ()
                    setLoading(false);
                } else {
                    setTimeout(checkAndUpdate, 2000); // Повторный запрос через 2 секунды
                }
            } else {
                setTimeout(checkAndUpdate, 2000); // Повторный запрос через 2 секунды
            }
        };

        checkAndUpdate();
    };

    const requestToServ = async () => {
        const result = await getAllUsersLeague()
        const userLegResult = await getUsersLeague()
        if (typeof userLegResult == "object") {
            setUsers(userLegResult)
        }
        if (typeof result == "object") {
            const sortedUsers = [...result].sort((a, b) => b.score - a.score);
            setusersList(sortedUsers)


            // Устанавливаем первые три места
            setFirstPlace(sortedUsers[0]);
            setSecondPlace(sortedUsers[1]);
            setThirdPlace(sortedUsers[2]);
        }
    }

    const handleNav = (marsh: string) => {
        navigate(`/${marsh}`);
    };

    useEffect(() => {
        if (!hasFetchedData.current) {
            setLoading(true)
            requestToServ().finally(() => {
                hasFetchedData.current = true
                setLoading(false)
            })
        }
    }, []);


    return (
        <div className="user-league-root-container">
            <div className="user-league-container-raspred">
                <div className="div-container-money-h">
                    <p className="tx-h1">Top Users</p>
                    <p className="div-tx-h2">Take Prizes and Get Prizes</p>
                    <div className="line-task-information"/>
                </div>
                <div className="catwalk-users-league">

                    <div className="podium">
                        {secondPlace && (
                            <div className="podium__item podium__second">
                                <div className="img-container">
                                    {secondPlace.imageAvatar != null ?
                                        (
                                            // <img className="image-profile" src={image}/>
                                            <img src={secondPlace.imageAvatar} className="ic-dog"/>
                                        ) :
                                        (
                                            // <div className="image-profile">
                                            <p style={{fontSize: '24px', color: 'black'}}>{secondPlace.userName[0]}</p>
                                            // </div>
                                        )
                                    }
                                </div>
                                <p className="labeling-place-podium second-place-labeling">2</p>

                                <h3>{secondPlace.userName.length > 5 ? secondPlace.userName.slice(0, 5) + '...' : secondPlace.userName}</h3>

                                <p className="gold-gradient-text">{formatNumberToK(secondPlace.score)}</p>


                                <div style={{
                                    display: "flex",
                                    flexDirection: 'row',
                                    alignContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <span className="reward-user-tx-place">100</span>
                                    <img src={TonIc} style={{
                                        width: '12px',
                                        height: '12px',
                                        marginRight: '4px',
                                        objectFit: 'contain',
                                        display: 'block',
                                        verticalAlign: 'middle',
                                        imageRendering: 'auto',
                                        borderRadius: '0px',
                                    }}/>
                                </div>

                            </div>
                        )}

                        {firstPlace && (
                            <div className="podium__item podium__first">
                                <div className="img-container">
                                    {firstPlace.imageAvatar != null ?
                                        (
                                            <img src={firstPlace.imageAvatar} className="ic-dog"/>
                                        ) :
                                        (
                                            <p style={{fontSize: '24px', color: 'black'}}>{firstPlace.userName[0]}</p>
                                        )
                                    }
                                </div>
                                <p className="labeling-place-podium first-place-labeling">1</p>
                                <h3>{firstPlace.userName.length > 5 ? firstPlace.userName.slice(0, 5) + '...' : firstPlace.userName}</h3>

                                <p className="gold-gradient-text">{formatNumberToK(firstPlace.score)}</p>
                                <div style={{
                                    display: "flex",
                                    flexDirection: 'row',
                                    alignContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <span className="reward-user-tx-place">200</span>
                                    <img src={TonIc} style={{
                                        width: '12px',
                                        height: '12px',
                                        marginRight: '4px',
                                        objectFit: 'contain',
                                        display: 'block',
                                        verticalAlign: 'middle',
                                        imageRendering: 'auto',
                                        borderRadius: '0px',
                                    }}/>
                                </div>

                            </div>
                        )}

                        {thirdPlace && (
                            <div className="podium__item podium__third">
                                <div className="img-container">
                                    {thirdPlace.imageAvatar != null ?
                                        (
                                            // <img className="image-profile" src={image}/>
                                            <img src={thirdPlace.imageAvatar} className="ic-dog"/>
                                        ) :
                                        (
                                            // <div className="image-profile">
                                            <p style={{fontSize: '24px', color: 'black'}}>{thirdPlace.userName[0]}</p>
                                            // </div>
                                        )
                                    }
                                </div>
                                <p className="labeling-place-podium third-place-labeling">3</p>
                                <h3>{thirdPlace.userName.length > 5 ? thirdPlace.userName.slice(0, 5) + '...' : thirdPlace.userName}</h3>

                                <p className="gold-gradient-text">{formatNumberToK(thirdPlace.score)}</p>


                                <div style={{
                                    display: "flex",
                                    flexDirection: 'row',
                                    alignContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <span className="reward-user-tx-place">50</span>
                                    <img src={TonIc} style={{
                                        width: '12px',
                                        height: '12px',
                                        marginRight: '4px',
                                        objectFit: 'contain',
                                        display: 'block',
                                        verticalAlign: 'middle',
                                        imageRendering: 'auto',
                                        borderRadius: '0px',
                                    }}/>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="reward-user">
                        <div style={{
                            display: "flex",
                            flexDirection: 'row',
                            alignContent: 'center',
                            alignItems: 'center'
                        }} onClick={() => {
                            setBottomSheetVisibleAbout(true)
                        }}>
                            <span className="reward-user-tx">Your reward</span>
                            <img className="coins-ico-stat" src={icIncoCircle}/>
                        </div>

                        <div style={{
                            display: "flex",
                            flexDirection: 'row',
                            alignContent: 'center',
                            alignItems: 'center'
                        }}>
                            <span
                                className="reward-user-tx-tw"> {users?.reward ? formatNumberToK(users.reward) : 0}</span>
                            <img src={TonIc} style={{
                                width: '16px',
                                height: '16px',
                                marginRight: '4px',
                                objectFit: 'contain',
                                display: 'block',
                                verticalAlign: 'middle',
                                imageRendering: 'auto',
                                borderRadius: '0px',
                                filter: 'invert(35%) sepia(100%) saturate(6000%) hue-rotate(200deg) brightness(100%) contrast(100%)'
                            }}/>
                        </div>

                    </div>

                    <div className="btn-boost-rank-users-league" onClick={() => {
                        setRatingBottomSheetVisible(true)
                    }}>
                        <span className="tx-boost-rank-users-league">Boost Rank</span>
                    </div>
                </div>

                {usersList.map((user, index) => (
                    <div key={index} className="user-league-container">
                        <ItemFriends
                            coinsReferral={`${user.score}`}
                            userName={user.userName}
                            position={index + 1}
                            selected={false}
                            imageCoins={IcCoinsRating}
                        />
                    </div>
                ))}
            </div>

            <div className="user-league-container">
                {users && (
                    <ItemFriends
                        coinsReferral={`${users.score}`}
                        userName={users.userName}
                        position={"Your position"}
                        selected={true}
                        imageCoins={IcCoinsRating}
                    />
                )
                }
            </div>

            <div style={{height: '8px'}}/>

            <NavigationBar
                initialSelected="Rating"
                onEarnClick={() => handleNav("Tap")}
                onInviteClick={() => handleNav("friends")}
                onProfileClick={() => handleNav("profile")}
                onTasksClick={() => handleNav("tasks")}
                onRatingClick={() => {
                }}
            />

            <UserLeagueUpRatingModal isVisible={isRatingBottomSheetVisible} onClose={closeBottomSheet}
                                     onBtnClick={ProcessingPaidResult}/>


            <ModalAbout title={"How do rewards work"} isVisible={isBottomSheetVisibleAbout}
                        onClose={closeBottomSheet} descriptions={"Rewards, get every week, 3 players with the highest rating, rating can be purchased, or get for completing tasks"}/>

            {loading && <ProgressBar/>}
        </div>
    )
}

export default UserLeagueScreen;