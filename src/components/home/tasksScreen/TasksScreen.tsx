import React, {useEffect, useState} from "react";
import './TasksScreen.css';
import ItemTask, {
    isOpenUrlTask,
    OpenUrlTask,
    isSampleTask,
    CheckNftTask,
    isCheckFriendsTask, IsSubscribeToTg, IsStockReg, StockRegTask,
} from "./itemTask/ItemTask";
import {useData} from "../../DataContext.tsx";
import {
    checkSuccessTask,
    updateTaskCompletion,
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

const TasksScreen: React.FC = () => {
    const { dataApp, setDataApp } = useData();

    const { showToast } = useToast();

    try {
        useTelegramBackButton(true)
    } catch (e ) {
        console.log("error in postEvent - ", e)
    }

    const handleShowToast = (message: string, type: 'success' | 'error' | 'info') => {
        showToast(message, type);
    };

    const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState<UserTask | null>(null);
    const navigate = useNavigate();
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
        if(SselectedTask != undefined) {
            try {
                updateTaskState(SselectedTask.taskId, { isLoading: true });
                const requestToCheck = await checkSuccessTask(SselectedTask.taskId)
                if (typeof requestToCheck === 'object') {
                    setDataApp(requestToCheck);
                    handleShowToast("The checking was successful", 'success')
                    closeBottomSheet()
                } else  {
                    handleShowToast(requestToCheck, 'error')
                }
            }catch (e) {

            } finally {
                updateTaskState(SselectedTask.taskId, { isLoading: false });
            }

        }
    }

    const handleNav = (marsh: string) => {
        navigate(`/${marsh}`);
    };

    useEffect(() => {
        console.log("dataApp - ", dataApp.coins);
        if(dataApp.userId == "") {
            handleNav("/loading")
        }
    }, [dataApp]);

    const [tabSelected, setTabSelected] = useState<string>("All Tasks");

    const handleTabSelect = (selectedTab: string) => {
        console.log(`Selected tab: ${selectedTab}`);
        setTabSelected(selectedTab)
    };

    const sendToTg = () => {

        const shareMessage = `https://t.me/StenBitTestBot?start=${dataApp.codeToInvite}
` +
            "\n" +
            "Play with me and get the opportunity to become a token holder through airdrop!\n" +
            "💸 +2k coins as your first gift\n" +
            "🔥 +10k coins if you have Telegram Premium";
        const telegramShareUrl = `https://t.me/share/url?url=&text=${encodeURIComponent(shareMessage)}`;

        OpenUrl(telegramShareUrl)
    };


    const handleCheckUserInvited =async (selectedsTask: UserTask) => {
        if (isCheckFriendsTask(selectedsTask.taskType)) {
            const numberOfFriends = selectedsTask.taskType.numberOfFriends;
            console.log('Number of friends:', numberOfFriends);
            const lengthUserInvited = dataApp.listUserInvited?.length ?? 0;

            if(lengthUserInvited == numberOfFriends && dataApp.userId != null) {
                updateTaskState(selectedsTask.taskId, {isLoading: true})
                const resultSendTorequest = await updateTaskCompletion(selectedsTask.taskId)
                if (typeof resultSendTorequest === 'object') {
                    setDataApp(resultSendTorequest)
                    updateTaskState(selectedsTask.taskId, { checkResult: true, errorMessage: null });
                    handleShowToast("The checking was successful", 'success')
                    closeBottomSheet()
                } else {
                    updateTaskState(selectedsTask.taskId, { checkResult: false, errorMessage: "" });
                    console.error('Task type is not CheckFriendsTask');
                }
            } else  {
                handleShowToast("The task is not completed", 'error')
                updateTaskState(selectedsTask.taskId, { checkResult: false, errorMessage: "The task is not completed" });
            }
        } else {
            console.error('Task type is not CheckFriendsTask');
        }
    };

    console.log("tasks - ",dataApp.tasks)

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
                            tabs={['All Tasks', 'Daily Tasks', 'Challenge']}
                            onTabSelect={handleTabSelect}
                        />

                    {dataApp.tasks != null && (
                        <div className="container-tasks-item-category">
                            {tabSelected === "All Tasks" && (
                                <div>

                                    <p className="tx-h1-container-tasks-item-category">Daily Tasks</p>
                                    {dataApp.tasks.map((task, index) => (
                                        <div>
                                            {task.type === "DailyTask" && (
                                                <div>
                                                    <ItemTask
                                                        key={index}
                                                        id={task.taskId}
                                                        text={task.text}
                                                        coins={task.coins}
                                                        completed={task.completed}
                                                        checkIcon={task.checkIcon}
                                                        taskType={task.taskType}
                                                        onClick={() => openBottomSheet(task)}
                                                        isLoading={false}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                    ))}

                                    <p className="tx-h1-container-tasks-item-category">Challenge</p>
                                    {dataApp.tasks.map((task, index) => (
                                        <div>
                                            {task.type === "challenge" && (
                                                <div>
                                                    <ItemTask
                                                        key={index}
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

                                    ))}

                                </div>
                            )}

                            {tabSelected === "Daily Tasks" && (
                                <div>
                                    <p className="tx-h1-container-tasks-item-category">Daily Tasks</p>
                                    {dataApp.tasks.map((task, index) => (
                                        <div>
                                            {task.type === "DailyTask" && (
                                                <div>
                                                    <ItemTask
                                                        key={index}
                                                        id={task.taskId}
                                                        text={task.text}
                                                        coins={task.coins}
                                                        completed={task.completed}
                                                        checkIcon={task.checkIcon}
                                                        taskType={task.taskType}
                                                        onClick={() => openBottomSheet(task)}
                                                        isLoading={false}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                    ))}
                                </div>
                            )}

                            {tabSelected === "Challenge" && (
                                <div>
                                    <p className="tx-h1-container-tasks-item-category">Challenge</p>
                                    {dataApp.tasks.map((task, index) => (
                                        <div>
                                            {task.type === "challenge" && (
                                                <div>
                                                    <ItemTask
                                                        key={index}
                                                        id={task.taskId}
                                                        text={task.text}
                                                        coins={task.coins}
                                                        completed={task.completed}
                                                        checkIcon={task.checkIcon}
                                                        taskType={task.taskType}
                                                        onClick={() => openBottomSheet(task)}
                                                        isLoading={false}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                    ))}
                                </div>
                            )}

                        </div>
                    )}
                </div>
            </div>


            <NavigationBar
                initialSelected={"Tasks"}
                onEarnClick={() => handleNav("tap")}
                onInviteClick={() =>handleNav("friends")}
                onProfileClick={() => handleNav("profile")}
                onTasksClick={() => {}}
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

                                    <SecondActionBtn txInBtn={selectedTask.actionBtnTx ? selectedTask.actionBtnTx : "Join"}
                                                     onClick={() => OpenUrl(`${(selectedTask.taskType as OpenUrlTask).url}`)}/>
                                    <div style={{width: '16px', height: '16px'}}/>

                                    <MainActionBtn
                                        txInBtn={taskStates[selectedTask.taskId]?.isLoading ? 'Checking...' : 'Check'}
                                        onClick={checkTask}/>
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

                                    <SecondActionBtn txInBtn={selectedTask.actionBtnTx ? selectedTask.actionBtnTx : "Join"}
                                                     onClick={() => OpenUrl(`${(selectedTask.taskType as OpenUrlTask).url}`)}/>
                                    <div style={{width: '16px', height: '16px'}}/>

                                    <MainActionBtn
                                        txInBtn={taskStates[selectedTask.taskId]?.isLoading ? 'Checking...' : 'Check'}
                                        onClick={checkTask}/>
                                </div>
                            )}

                            {isCheckFriendsTask(selectedTask.taskType) && (
                                <div className="bottom-sheet-content-task">
                                    <p className="tx-ref-link">Referral link</p>
                                    <div className="copy-container-task">
                                        <div className="text-container-task">
                                            <span
                                                className="text-content">https://t.me/StenBitTestBot?start={dataApp.codeToInvite}</span>
                                        </div>
                                        <button className="copy-button"
                                                onClick={() => handleCopy(`https://t.me/StenBitTestBot?start=${dataApp.codeToInvite}`)}>
                                            <img src={IcCopy} alt="Copy"/>
                                        </button>
                                    </div>
                                    <div className="btn-action-containe-modal-inviter">
                                        <SecondActionBtn txInBtn={taskStates[selectedTask.taskId]?.isLoading ? 'Checking...' : 'Check'} onClick={() => handleCheckUserInvited(selectedTask)}/>
                                        <div style={{width: '16px', height: '16px'}}/>
                                        <MainActionBtn imageSourse={IcSend} txInBtn={"Send Link"} onClick={sendToTg}/>
                                    </div>
                                </div>
                            )}


                            {isSampleTask(selectedTask.taskType) && (
                                <button className="button-action-sheet" onClick={closeBottomSheet}>
                                    <p className="tx-action-sheet">
                                        Продолжить
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

                                    <SecondActionBtn txInBtn={"Buy NFT"} onClick={() => OpenUrl(`https://testnet.getgems.io/collection/${(selectedTask.taskType as CheckNftTask).checkCollectionsAddress}`)}/>
                                    <div style={{width: '16px', height: '16px'}}/>

                                    <MainActionBtn
                                        txInBtn={taskStates[selectedTask.taskId]?.isLoading ? 'Checking...' : 'Check'}
                                        onClick={checkTask}/>

                                </div>
                            )}

                            {IsStockReg(selectedTask.taskType) && (
                                <div className="bottom-sheet-content-task">
                                    <p className="description-task">{selectedTask.txDescription}</p>
                                    <div className="reward-container-task">
                                        <img src={IcCoins} className="ic-reward-container-coins"/>
                                        <p className="tx-reward-container-coins">+ {selectedTask.coins}</p>
                                    </div>
                                    <div style={{width: '24px', height: '24px'}}/>

                                    <SecondActionBtn txInBtn={"Registration"} onClick={() => OpenUrl(`${(selectedTask.taskType as StockRegTask).url}`)}/>
                                    <div style={{width: '16px', height: '16px'}}/>

                                    <MainActionBtn
                                        txInBtn={taskStates[selectedTask.taskId]?.isLoading ? 'Checking...' : 'Check'}
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