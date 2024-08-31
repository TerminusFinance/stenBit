import React, {useEffect, useState} from "react";
import './TasksScreen.css';
import ItemTask, {
    isOpenUrlTask,
    OpenUrlTask,
    isSampleTask,
    CheckNftTask,
    isCheckFriendsTask,
    IsSubscribeToTg,
    IsStockReg,
    ISDailyTask,
    IsInternalChallengeTask,
    IsTransferToneTask,
    IsCheckStarsSendersTask, IsDaysChallengeTask,
} from "./itemTask/ItemTask";
import {useData} from "../../DataContext.tsx";
import {
    checkSuccessTask,
    UserTask
} from "../../../core/dataWork/RemoteUtilsRequester.ts";
import NavigationBar from "../../navigationBar/NavigationBar.tsx";
import {useNavigate} from "react-router-dom";
import TaskSelector from "./taskSelector/TaskSelector.tsx";
import {ModalTaskMulti} from "./modalTaskMulti/ModalTaskMulti.tsx";
import IcCopy from "../../../assets/ic_copy.svg";
import {MainActionBtn} from "../../buttons/mainActionBtn/MainActionBtn.tsx";
import IcSend from "../../../assets/ic_send.svg";
import {SecondActionBtn} from "../../buttons/secondActionBtn/SecondActionBtn.tsx";
import {useToast} from "../../viewComponents/toast/ToastContext.tsx";
import IcCoins from "../../../assets/ic_dollar.svg";
import {handleCopy, OpenUrl, useTelegramBackButton} from "../../viewComponents/Utils.tsx";
import {useTonConnectUI, useTonWallet} from "@tonconnect/ui-react";
import {Address, beginCell, toNano} from "ton-core";

const TasksScreen: React.FC = () => {
    const {dataApp, setDataApp} = useData();

    const {showToast} = useToast();

    try {
        useTelegramBackButton(true)
    } catch (e) {
        console.log("error in postEvent - ", e)
    }

    const handleShowToast = (message: string, type: 'success' | 'error' | 'info') => {
        showToast(message, type);
    };

    const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState<UserTask | null>(null);
    const [visitUrl, setVisitUrl] = useState<boolean>(false);
    const navigate = useNavigate();
    const [tonConnectUI] = useTonConnectUI();
    const wallet = useTonWallet();


    const [userLanguage, setUserLanguage] = useState<string>('');
    useEffect(() => {
        // Получаем основной язык пользователя
        const language = navigator.language || navigator.languages[0];

        const primaryLanguage = language.split('-')[0];

        // Устанавливаем язык в состояние компонента
        setUserLanguage(primaryLanguage);
        console.log("userLanguage - ",primaryLanguage, userLanguage)
    }, []);

    const openBottomSheet = (task: UserTask) => {
        if (!task.completed) {
            setSelectedTask(task);
            setBottomSheetVisible(true);
        }
    };
    // Создание состояния для хранения статусов задач
    const [taskStates, setTaskStates] = useState<Record<number, {
        isLoading: boolean;
        checkResult: boolean | null;
        errorMessage: string | null;
    }>>({});

    const closeBottomSheet = () => {
        setBottomSheetVisible(false);
        setSelectedTask(null);
        setTaskStates({})
        setVisitUrl(false)
    };


    const updateTaskState = (taskId: number, newState: Partial<typeof taskStates[number]>) => {
        setTaskStates(prevStates => ({
            ...prevStates,
            [taskId]: {
                ...prevStates[taskId],
                ...newState,
            }
        }));
    };

    const checkTask = async () => {
        const SselectedTask = selectedTask;
        if (SselectedTask != undefined) {
            try {
                updateTaskState(SselectedTask.taskId, {isLoading: true});
                const requestToCheck = await checkSuccessTask(SselectedTask.taskId)
                if (typeof requestToCheck === 'object') {
                    setDataApp(requestToCheck);
                    if (IsStockReg(SselectedTask.taskType)) {
                        if (SselectedTask.etaps == 0 || SselectedTask.etaps == 2) {
                            handleShowToast("Your task has been sent for verification", 'info')
                        } else {
                            handleShowToast("The checking was successful", 'success')
                        }
                    } else if (isOpenUrlTask(SselectedTask.taskType)) {
                        if (SselectedTask.etaps == 0 || SselectedTask.etaps == 2) {
                            handleShowToast("Your task has been sent for verification", 'info')
                        } else {
                            handleShowToast("The checking was successful", 'success')
                        }
                    } else {
                        handleShowToast("The checking was successful", 'success')
                    }
                    closeBottomSheet()
                } else {
                    handleShowToast("You didn't fulfil the conditions ", 'error')
                }
            } catch (e) {
                handleShowToast("You didn't fulfil the conditions ", 'error')
            } finally {
                updateTaskState(SselectedTask.taskId, {isLoading: false});
            }

        }
    }

    const handleNav = (marsh: string) => {
        navigate(`/${marsh}`);
    };

    useEffect(() => {
        console.log("dataApp - ", dataApp.coins);
        if (dataApp.userId == "") {
            handleNav("/loading")
        }
    }, [dataApp]);

    const [tabSelected, setTabSelected] = useState<string>("All Tasks");

    const handleTabSelect = (selectedTab: string) => {
        console.log(`Selected tab: ${selectedTab}`);
        setTabSelected(selectedTab)
    };

    const sendToTg = () => {

        const shareMessage = `t.me/TerminusCoinbot/Farm?startapp=${dataApp.codeToInvite}
` +
            "\n" +
            "Play with me and get the opportunity to become a token holder through airdrop!\n" +
            "💸 +2k coins as your first gift\n" +
            "🔥 +10k coins if you have Telegram Premium";
        const telegramShareUrl = `https://t.me/share/url?url=&text=${encodeURIComponent(shareMessage)}`;

        OpenUrl(telegramShareUrl)
    };


    const SendTransactions = async () => {
        if (selectedTask != null) {
            if (IsTransferToneTask(selectedTask.taskType) || IsDaysChallengeTask(selectedTask.taskType)) {
                const amount = selectedTask.taskType.price
                const address = selectedTask.taskType.addressToTransfer
                const body = beginCell()
                    .storeUint(0, 32) // write 32 zero bits to indicate that a text comment will follow
                    .storeStringTail(dataApp.userId) // write our text comment
                    .endCell()
                const transaction = {
                    validUntil: Date.now() + 1000000,
                    messages: [
                        {
                            address: address,
                            amount: toNano(amount).toString(),
                            payload: body.toBoc().toString("base64") // payload with comment in body
                        },
                    ]
                }
                try {
                    const addressWallet = wallet?.account?.address ? Address.parse(wallet?.account?.address as string) : undefined;
                    if (addressWallet == undefined) {
                        tonConnectUI.modal.open()
                    } else {

                        await tonConnectUI.sendTransaction(transaction)
                    }
                } catch (e) {
                    console.error(e);
                }
            }
        }

    }

    console.log("tasks - ", dataApp.tasks)
    return (
        <div className="tasks-container">
            <div className="task-raspred-container">
                <div className="div-container-money-h">
                    <p className="tx-h1">Tasks</p>
                    <p className="div-tx-h2">Earn more coins by <br/>completing simple tasks</p>
                    <div className="line-task-information"/>
                </div>
                <div className="list-task-container">

                    <TaskSelector
                        tabs={['All Tasks', 'Daily Tasks', 'Challenge', "Stock", "Social", "Apps"]}
                        onTabSelect={handleTabSelect}
                    />

                    {dataApp.tasks != null && (
                        <div className="container-tasks-item-category">
                            {tabSelected === "All Tasks" && (
                                <div>

                                    <p className="tx-h1-container-tasks-item-category">Daily Tasks</p>
                                    {dataApp.tasks.map((task, index) => {

                                        if (task.completed) {
                                            return null;
                                        }


                                        if(typeof task.sortLocal == "string") {
                                            if(task.sortLocal != "" || userLanguage != "") {
                                                if(task.sortLocal != userLanguage) {
                                                    return null;
                                                }
                                            }
                                        }

                                        return (
                                            <div key={index}>
                                                {task.type === "DailyTask" && (
                                                    <div>
                                                        <ItemTask
                                                            id={task.taskId}
                                                            text={task.text}
                                                            coins={task.coins}
                                                            completed={task.completed}
                                                            checkIcon={task.checkIcon}
                                                            taskType={task.taskType}
                                                            onClick={() => openBottomSheet(task)}
                                                            isLoading={task.etaps === 1 || task.etaps === 3}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}


                                    <p className="tx-h1-container-tasks-item-category">Challenge</p>
                                    {dataApp.tasks.map((task, index) => {

                                        if (task.completed) {
                                            return null;
                                        }

                                        if(typeof task.sortLocal == "string") {
                                            if(task.sortLocal != "" || userLanguage != "") {
                                                if(task.sortLocal != userLanguage) {
                                                    return null;
                                                }
                                            }
                                        }

                                        return (
                                            <div key={index}>
                                                {task.type === "challenge" && (
                                                    <div>
                                                        <ItemTask
                                                            id={task.taskId}
                                                            text={task.text}
                                                            coins={task.coins}
                                                            completed={task.completed}
                                                            checkIcon={task.checkIcon}
                                                            taskType={task.taskType}
                                                            onClick={() => openBottomSheet(task)}
                                                            isLoading={task.etaps === 1 || task.etaps === 3}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}


                                    <p className="tx-h1-container-tasks-item-category">Stock</p>
                                    {dataApp.tasks.map((task, index) => {

                                        if (task.completed) {
                                            return null;
                                        }


                                        if(typeof task.sortLocal == "string") {
                                            if(task.sortLocal != "" || userLanguage != "") {
                                                if(task.sortLocal != userLanguage) {
                                                    return null;
                                                }
                                            }
                                        }

                                        return (
                                            <div key={index}>
                                                {task.type === "Stock" && (
                                                    <div>
                                                        <ItemTask
                                                            id={task.taskId}
                                                            text={task.text}
                                                            coins={task.coins}
                                                            completed={task.completed}
                                                            checkIcon={task.checkIcon}
                                                            taskType={task.taskType}
                                                            onClick={() => openBottomSheet(task)}
                                                            isLoading={task.etaps === 1 || task.etaps === 3}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}

                                    <p className="tx-h1-container-tasks-item-category">Social</p>
                                    {dataApp.tasks.map((task, index) => {

                                        if (task.completed) {
                                            return null;
                                        }


                                        if(typeof task.sortLocal == "string") {
                                            if(task.sortLocal != "" || userLanguage != "") {
                                                if(task.sortLocal != userLanguage) {
                                                    return null;
                                                }
                                            }
                                        }

                                        return (
                                            <div key={index}>
                                                {task.type === "Social" && (
                                                    <div>
                                                        <ItemTask
                                                            id={task.taskId}
                                                            text={task.text}
                                                            coins={task.coins}
                                                            completed={task.completed}
                                                            checkIcon={task.checkIcon}
                                                            taskType={task.taskType}
                                                            onClick={() => openBottomSheet(task)}
                                                            isLoading={task.etaps === 1 || task.etaps === 3}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}



                                    <p className="tx-h1-container-tasks-item-category">Apps</p>
                                    {dataApp.tasks.map((task, index) => {

                                        if (task.completed) {
                                            return null;
                                        }


                                        if(typeof task.sortLocal == "string") {
                                            if(task.sortLocal != "" || userLanguage != "") {
                                                if(task.sortLocal != userLanguage) {
                                                    return null;
                                                }
                                            }
                                        }

                                        return (
                                            <div key={index}>
                                                {task.type === "Apps" && (
                                                    <div>
                                                        <ItemTask
                                                            id={task.taskId}
                                                            text={task.text}
                                                            coins={task.coins}
                                                            completed={task.completed}
                                                            checkIcon={task.checkIcon}
                                                            taskType={task.taskType}
                                                            onClick={() => openBottomSheet(task)}
                                                            isLoading={task.etaps === 1 || task.etaps === 3}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}


                                </div>
                            )}

                            {tabSelected === "Daily Tasks" && (
                                <div>
                                    <p className="tx-h1-container-tasks-item-category">Daily Tasks</p>
                                    {dataApp.tasks.map((task, index) => {

                                        if (task.completed) {
                                            return null;
                                        }

                                        if(typeof task.sortLocal == "string") {
                                            if(task.sortLocal != "" || userLanguage != "") {
                                                if(task.sortLocal != userLanguage) {
                                                    return null;
                                                }
                                            }
                                        }

                                        return (
                                            <div key={index}>
                                                {task.type === "DailyTask" && (
                                                    <div>
                                                        <ItemTask
                                                            id={task.taskId}
                                                            text={task.text}
                                                            coins={task.coins}
                                                            completed={task.completed}
                                                            checkIcon={task.checkIcon}
                                                            taskType={task.taskType}
                                                            onClick={() => openBottomSheet(task)}
                                                            isLoading={task.etaps === 1 || task.etaps === 3}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {tabSelected === "Challenge" && (
                                <div>
                                    <p className="tx-h1-container-tasks-item-category">Challenge</p>
                                    {dataApp.tasks.map((task, index) => {

                                        if (task.completed) {
                                            return null;
                                        }

                                        if(typeof task.sortLocal == "string") {
                                            if(task.sortLocal != "" || userLanguage != "") {
                                                if(task.sortLocal != userLanguage) {
                                                    return null;
                                                }
                                            }
                                        }

                                        return (
                                            <div key={index}>
                                                {task.type === "challenge" && (
                                                    <div>
                                                        <ItemTask
                                                            id={task.taskId}
                                                            text={task.text}
                                                            coins={task.coins}
                                                            completed={task.completed}
                                                            checkIcon={task.checkIcon}
                                                            taskType={task.taskType}
                                                            onClick={() => openBottomSheet(task)}
                                                            isLoading={task.etaps === 1 || task.etaps === 3}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {tabSelected === "Stock" && (
                                <div>
                                    <p className="tx-h1-container-tasks-item-category">Stock</p>
                                    {dataApp.tasks.map((task, index) => {

                                        if (task.completed) {
                                            return null;
                                        }

                                        if(typeof task.sortLocal == "string") {
                                            if(task.sortLocal != "" || userLanguage != "") {
                                                if(task.sortLocal != userLanguage) {
                                                    return null;
                                                }
                                            }
                                        }

                                        return (
                                            <div key={index}>
                                                {task.type === "Stock" && (
                                                    <div>
                                                        <ItemTask
                                                            id={task.taskId}
                                                            text={task.text}
                                                            coins={task.coins}
                                                            completed={task.completed}
                                                            checkIcon={task.checkIcon}
                                                            taskType={task.taskType}
                                                            onClick={() => openBottomSheet(task)}
                                                            isLoading={task.etaps === 1 || task.etaps === 3}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {tabSelected === "Social" && (
                                <div>
                                    <p className="tx-h1-container-tasks-item-category">Social</p>
                                    {dataApp.tasks.map((task, index) => {

                                        if (task.completed) {
                                            return null;
                                        }

                                        if(typeof task.sortLocal == "string") {
                                            if(task.sortLocal != "" || userLanguage != "") {
                                                if(task.sortLocal != userLanguage) {
                                                    return null;
                                                }
                                            }
                                        }

                                        return (
                                            <div key={index}>
                                                {task.type === "Social" && (
                                                    <div>
                                                        <ItemTask
                                                            id={task.taskId}
                                                            text={task.text}
                                                            coins={task.coins}
                                                            completed={task.completed}
                                                            checkIcon={task.checkIcon}
                                                            taskType={task.taskType}
                                                            onClick={() => openBottomSheet(task)}
                                                            isLoading={task.etaps === 1 || task.etaps === 3}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}


                            {tabSelected === "Apps" && (
                                <div>
                                    <p className="tx-h1-container-tasks-item-category">Social</p>
                                    {dataApp.tasks.map((task, index) => {

                                        if (task.completed) {
                                            return null;
                                        }

                                        if(typeof task.sortLocal == "string") {
                                            if(task.sortLocal != "" || userLanguage != "") {
                                                if(task.sortLocal != userLanguage) {
                                                    return null;
                                                }
                                            }
                                        }

                                        return (
                                            <div key={index}>
                                                {task.type === "Apps" && (
                                                    <div>
                                                        <ItemTask
                                                            id={task.taskId}
                                                            text={task.text}
                                                            coins={task.coins}
                                                            completed={task.completed}
                                                            checkIcon={task.checkIcon}
                                                            taskType={task.taskType}
                                                            onClick={() => openBottomSheet(task)}
                                                            isLoading={task.etaps === 1 || task.etaps === 3}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                        </div>
                    )}
                </div>
            </div>


            <NavigationBar
                initialSelected={"Tasks"}
                onEarnClick={() => handleNav("tap")}
                onInviteClick={() => handleNav("friends")}
                onProfileClick={() => handleNav("profile")}
                onTasksClick={() => {
                }}
                onRatingClick={() => handleNav("userLeagues")}
            />

            {selectedTask && (
                <ModalTaskMulti
                    isVisible={isBottomSheetVisible}
                    onClose={closeBottomSheet}
                    image={selectedTask.checkIcon}
                    title={selectedTask.text}
                    content={
                        <div>
                            {isOpenUrlTask(selectedTask.taskType) && (
                                <div className="bottom-sheet-content-task">
                                    <p className="description-task">
                                        {selectedTask.txDescription}
                                    </p>
                                    <div className="reward-container-task">
                                        <img src={IcCoins} className="ic-reward-container-coins"/>
                                        <p className="tx-reward-container-coins">+ {selectedTask.coins}</p>
                                    </div>

                                    <div style={{width: '24px', height: '24px'}}/>

                                    <SecondActionBtn
                                        txInBtn={selectedTask.actionBtnTx ? selectedTask.actionBtnTx : "Join"}
                                        onClick={() => {
                                            OpenUrl(`${(selectedTask.taskType as OpenUrlTask).url}`)
                                            setVisitUrl(true)
                                        }
                                        }/>
                                    <div style={{width: '16px', height: '16px'}}/>
                                    <MainActionBtn
                                        txInBtn={taskStates[selectedTask.taskId]?.isLoading ? 'Checking...' : 'Check'}
                                        onClick={() => {
                                            if (visitUrl) {
                                                checkTask();
                                            } else {
                                                //
                                            }
                                        }}
                                    />
                                </div>
                            )}

                            {IsSubscribeToTg(selectedTask.taskType) && (
                                <div className="bottom-sheet-content-task">
                                    <p className="description-task">
                                        {selectedTask.txDescription}
                                    </p>
                                    <div className="reward-container-task">
                                        <img src={IcCoins} className="ic-reward-container-coins"/>
                                        <p className="tx-reward-container-coins">+ {selectedTask.coins}</p>
                                    </div>

                                    <div style={{width: '24px', height: '24px'}}/>

                                    <SecondActionBtn
                                        txInBtn={selectedTask.actionBtnTx ? selectedTask.actionBtnTx : "Join"}
                                        onClick={() => {
                                            OpenUrl(`${(selectedTask.taskType as OpenUrlTask).url}`)
                                            setVisitUrl(true)
                                        }}/>
                                    <div style={{width: '16px', height: '16px'}}/>

                                    <MainActionBtn
                                        txInBtn={taskStates[selectedTask.taskId]?.isLoading ? 'Checking...' : 'Check'}
                                        onClick={() => {
                                            if (visitUrl) {
                                                checkTask();
                                            } else {
                                                //
                                            }
                                        }}/>
                                </div>
                            )}

                            {isCheckFriendsTask(selectedTask.taskType) && (
                                <div className="bottom-sheet-content-task">
                                    <p className="tx-ref-link">Referral link</p>
                                    <div className="copy-container-task">
                                        <div className="text-container-task">
                                            <span
                                                className="text-content">t.me/TerminusCoinbot/Farm?startapp={dataApp.codeToInvite}</span>
                                        </div>
                                        <button className="copy-button"
                                                onClick={() => {
                                                    handleCopy(`t.me/TerminusCoinbot/Farm?startapp=${dataApp.codeToInvite}`)
                                                    handleShowToast("Link copied", 'success')
                                                }
                                                }>
                                            <img src={IcCopy} alt="Copy"/>
                                        </button>
                                    </div>
                                    <div className="btn-action-containe-modal-inviter">
                                        <SecondActionBtn
                                            txInBtn={taskStates[selectedTask.taskId]?.isLoading ? 'Checking...' : 'Check'}
                                            onClick={() => checkTask()}/>
                                        <div style={{width: '16px', height: '16px'}}/>
                                        <MainActionBtn imageSourse={IcSend} txInBtn={"Send Link"} onClick={sendToTg}/>
                                    </div>
                                </div>
                            )}

                            {isSampleTask(selectedTask.taskType) && (
                                <button className="button-action-sheet" onClick={closeBottomSheet}>
                                    <p className="tx-action-sheet">
                                        Next
                                    </p>
                                </button>
                            )}

                            {CheckNftTask(selectedTask.taskType) && (
                                <div className="bottom-sheet-content-task">
                                    <p className="description-task">{selectedTask.txDescription}</p>
                                    <div className="reward-container-task">
                                        <img src={IcCoins} className="ic-reward-container-coins"/>
                                        <p className="tx-reward-container-coins">+ {selectedTask.coins}</p>
                                    </div>
                                    <div style={{width: '24px', height: '24px'}}/>

                                    <SecondActionBtn txInBtn={"Buy NFT"}
                                                     onClick={() => {
                                                         OpenUrl(`https://getgems.io/collection/${(selectedTask.taskType as CheckNftTask).checkCollectionsAddress}`)
                                                         setVisitUrl(true)
                                                     }}/>
                                    <div style={{width: '16px', height: '16px'}}/>

                                    <MainActionBtn
                                        txInBtn={taskStates[selectedTask.taskId]?.isLoading ? 'Checking...' : 'Check'}
                                        onClick={() => {
                                            if (visitUrl) {
                                                checkTask();
                                            } else {
                                                //
                                            }
                                        }}/>

                                </div>
                            )}

                            {IsStockReg(selectedTask.taskType) && (
                                <div className="bottom-sheet-content-task">
                                    <p className="description-task">{selectedTask.etaps == 2 ? "Your KYC check was failed, send it again." : selectedTask.txDescription}</p>
                                    <div className="reward-container-task">
                                        <img src={IcCoins} className="ic-reward-container-coins"/>
                                        <p className="tx-reward-container-coins">+ {selectedTask.coins}</p>
                                    </div>
                                    <div style={{width: '24px', height: '24px'}}/>

                                    <SecondActionBtn txInBtn={"Registration"}
                                                     onClick={() => {
                                                         OpenUrl(`${(selectedTask.taskType as OpenUrlTask).url}`)
                                                         setVisitUrl(true)
                                                     }}/>
                                    <div style={{width: '16px', height: '16px'}}/>

                                    <MainActionBtn
                                        txInBtn={taskStates[selectedTask.taskId]?.isLoading ? 'Checking...' : 'Check'}
                                        onClick={() => {
                                            if (visitUrl) {
                                                checkTask();
                                            } else {
                                                //
                                            }
                                        }}/>

                                </div>
                            )}

                            {ISDailyTask(selectedTask.taskType) && (
                                <div className="bottom-sheet-content-task">
                                    <p className="description-task">{selectedTask.txDescription}</p>
                                    <div className="reward-container-task">
                                        <img src={IcCoins} className="ic-reward-container-coins"/>
                                        <p className="tx-reward-container-coins">+ {selectedTask.coins}</p>
                                    </div>
                                    <div style={{width: '24px', height: '24px'}}/>

                                    <MainActionBtn
                                        txInBtn={taskStates[selectedTask.taskId]?.isLoading ? 'Checking...' : selectedTask.actionBtnTx ? selectedTask.actionBtnTx : 'Check'}
                                        onClick={checkTask}/>
                                </div>
                            )}

                            {IsInternalChallengeTask(selectedTask.taskType) && (
                                <div className="bottom-sheet-content-task">
                                    <p className="description-task">{selectedTask.txDescription}</p>
                                    <div className="reward-container-task">
                                        <img src={IcCoins} className="ic-reward-container-coins"/>
                                        <p className="tx-reward-container-coins">+ {selectedTask.coins}</p>
                                    </div>
                                    <div style={{width: '24px', height: '24px'}}/>

                                    <MainActionBtn
                                        txInBtn={taskStates[selectedTask.taskId]?.isLoading ? 'Checking...' : selectedTask.actionBtnTx ? selectedTask.actionBtnTx : 'Check'}
                                        onClick={checkTask}/>
                                </div>
                            )}

                            {IsTransferToneTask(selectedTask.taskType) && (
                                <div className="bottom-sheet-content-task">
                                    <p className="description-task">{selectedTask.txDescription}</p>
                                    <div className="reward-container-task">
                                        <img src={IcCoins} className="ic-reward-container-coins"/>
                                        <p className="tx-reward-container-coins">+ {selectedTask.coins}</p>
                                    </div>


                                    <div style={{width: '24px', height: '24px'}}/>
                                    <SecondActionBtn txInBtn={"Send"}
                                                     onClick={() => {
                                                         SendTransactions()
                                                         setVisitUrl(true)
                                                     }}/>
                                    <div style={{width: '16px', height: '16px'}}/>
                                    <MainActionBtn
                                        txInBtn={taskStates[selectedTask.taskId]?.isLoading ? 'Checking...' : selectedTask.actionBtnTx ? selectedTask.actionBtnTx : 'Check'}
                                        onClick={checkTask}/>
                                </div>
                            )}

                            {IsCheckStarsSendersTask(selectedTask.taskType) && (
                                <div className="bottom-sheet-content-task">
                                    <p className="description-task">{selectedTask.txDescription}</p>
                                    <div className="reward-container-task">
                                        <img src={IcCoins} className="ic-reward-container-coins"/>
                                        <p className="tx-reward-container-coins">+ {selectedTask.coins}</p>
                                    </div>
                                    <div style={{width: '24px', height: '24px'}}/>

                                    <MainActionBtn
                                        txInBtn={taskStates[selectedTask.taskId]?.isLoading ? 'Checking...' : selectedTask.actionBtnTx ? selectedTask.actionBtnTx : 'Check'}
                                        onClick={checkTask}/>
                                </div>
                            )}


                            {IsDaysChallengeTask(selectedTask.taskType) && (
                                <div className="bottom-sheet-content-task">
                                    <p className="description-task">{selectedTask.txDescription}</p>
                                    <div className="reward-container-task">
                                        <img src={IcCoins} className="ic-reward-container-coins"/>
                                        <p className="tx-reward-container-coins">+ {selectedTask.coins}</p>
                                    </div>
                                    {selectedTask.storedValues != null &&
                                        (
                                            <div className="text-content">Executed
                                                transactions: {selectedTask.storedValues?.dayCompleted ? selectedTask.storedValues?.dayCompleted: 0 }/{selectedTask.taskType.days}</div>
                                        )}

                                    <div style={{width: '24px', height: '24px'}}/>
                                    <SecondActionBtn txInBtn={"Send"}
                                                     onClick={() => {
                                                         SendTransactions()
                                                         setVisitUrl(true)
                                                     }}/>
                                    <div style={{width: '16px', height: '16px'}}/>
                                    <MainActionBtn
                                        txInBtn={taskStates[selectedTask.taskId]?.isLoading ? 'Checking...' : selectedTask.actionBtnTx ? selectedTask.actionBtnTx : 'Check'}
                                        onClick={checkTask}/>
                                </div>
                            )}

                        </div>
                    }
                />
            )}
        </div>
    );
}

export default TasksScreen;