import React, {useState} from "react";
import './TasksScreen.css';
import coin from "../../../assets/ic_coins.png";
import ItemTask, {TaskCardProps, isOpenUrlTask, OpenUrlTask, isSampleTask, CheckNftTask} from "./itemTask/ItemTask";
import TelegramIco from "../../../assets/ic_telegram.png";
import XIco from "../../../assets/ic_x.png";
import ProfileIco from "../../../assets/profile_ico.png";
import BottomSheetTask from "./bottomSheetTask/BottomSheetTask";
import CoinsIco from "../../../assets/ic_coins.png";
import {useData} from "../../DataContext.tsx";
import {updateUser} from "../../../core/dataWork/Back4app.ts";
import {
    ResultCheckNftItem,
    sendToCheckUserHaveNftFromCollections
} from "../../../core/tonWork/checkToNftItem/CheckToNftitem.tsx";

const TasksScreen: React.FC = () => {
    const { dataApp, setDataApp } = useData();

    const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState<TaskCardProps | null>(null);

    const openBottomSheet = (task: TaskCardProps) => {
        if (!task.completed) {
            setSelectedTask(task);
            setBottomSheetVisible(true);
        }
    };

    const closeBottomSheet = () => {
        setBottomSheetVisible(false);
        setSelectedTask(null);
    };

    // Создание состояния для хранения статусов задач
    const [taskStates, setTaskStates] = useState<Record<number, {
        isLoading: boolean;
        checkResult: ResultCheckNftItem | null;
        errorMessage: string | null;
    }>>({});

    const updateTaskState = (taskId: number, newState: Partial<typeof taskStates[number]>) => {
        setTaskStates(prevStates => ({
            ...prevStates,
            [taskId]: {
                ...prevStates[taskId],
                ...newState,
            }
        }));
    };

    const checkNftItem = async () => {
        const userId = dataApp.userId;
        const userWallet = dataApp.address;
        const SselectedTask = selectedTask;
        const coindOld = dataApp.coins;
        const completedTaskOld = dataApp.completedTasks || [];
        if (SselectedTask != null && CheckNftTask(SselectedTask.taskType) && userId != null && coindOld != null) {
            const collectionAddress = SselectedTask.taskType.checkCollectionsAddress;

            if (userWallet != null) {
                updateTaskState(SselectedTask.id, { isLoading: true });

                try {
                    const checkResult = await sendToCheckUserHaveNftFromCollections(userWallet, collectionAddress);
                    updateTaskState(SselectedTask.id, { checkResult, errorMessage: null });
                    if(checkResult.state) {
                        const updatedCompletedTasks = [...completedTaskOld, SselectedTask.id];
                        const resultUpdate = await updateUser(userId, {
                            coins: coindOld + SselectedTask.coins,
                            completedTasks: updatedCompletedTasks
                        });
                        console.log("resultUdpate - ", resultUpdate)
                        setDataApp(resultUpdate);
                        closeBottomSheet()
                    }
                } catch (error) {
                    console.error('Error checking NFT:', error);
                    updateTaskState(SselectedTask.id, { errorMessage: 'Произошла ошибка при проверке NFT' });
                } finally {
                    updateTaskState(SselectedTask.id, { isLoading: false });
                }
            }
        }
    };

    const addedSuccessUrlSender = async () => {
        const userId = dataApp.userId;
        const coindOld = dataApp.coins;
        const completedTaskOld = dataApp.completedTasks || [];

        if (selectedTask != null && userId != undefined && coindOld != undefined) {
            if (isOpenUrlTask(selectedTask.taskType)) {
                window.open((selectedTask.taskType as OpenUrlTask).url, '_blank');

                if (!completedTaskOld.includes(selectedTask.id)) {
                    const updatedCompletedTasks = [...completedTaskOld, selectedTask.id];
                    const resultUpdate = await updateUser(userId, {
                        coins: coindOld + selectedTask.coins,
                        completedTasks: updatedCompletedTasks
                    });
                    setDataApp(resultUpdate);
                    closeBottomSheet()
                }
            }
        }
    };

    const itemTaskLists: TaskCardProps[] = [
        {
            id: 1,
            text: "Присоеденится к нашему telegram каналу",
            coins: 5000,
            completed: false,
            checkIcon: TelegramIco,
            taskType: {
                type: 'OpenUrl',
                url: 'https://t.me/+5rOLByXlu_g0MmIy'
            }
        },
        {
            id: 2,
            text: "Следи за нами в x",
            coins: 1,
            completed: false,
            checkIcon: XIco,
            taskType: {
                type: 'OpenUrl',
                url: 'https://t.me/+5rOLByXlu_g0MmIy'
            }
        },
        {
            id: 3,
            text: "Пригласи 3 друзей",
            coins: 1,
            completed: false,
            checkIcon: ProfileIco,
            taskType: {
                type: 'Sample'
            }
        },
        {
            id: 4,
            text: "Пригласи 10 друзей",
            coins: 1,
            completed: false,
            checkIcon: ProfileIco,
            taskType: {
                type: 'Sample'
            }
        },
        {
            id: 5,
            text: "Присоеденится к нашему telegram каналу",
            coins: 5000,
            completed: false,
            checkIcon: TelegramIco,
            taskType: {
                type: 'OpenUrl',
                url: 'https://t.me/+5rOLByXlu_g0MmIy'
            }
        },
        {
            id: 6,
            text: "Приобрести Nft из коллекции",
            coins: 125000,
            completed: false,
            checkIcon: TelegramIco,
            taskType: {
                type: 'CheckNft',
                checkCollectionsAddress: 'kQBRvxhdrViPDimj46_hk2jv53-2UFbbP0bUUu-vDT2-kzqS'
            }
        },
    ];

    const updatedTaskLists = itemTaskLists.map((task, index) => ({
        ...task,
        completed: Array.isArray(dataApp.completedTasks) && dataApp.completedTasks.includes(index + 1)
    }));

    return (
        <div className="tasks-container">
            <div className="div-container-money-h">
                <img
                    src={coin}
                    alt="Coin"
                    className="coin-visual"
                    draggable="false"
                    onClick={() => openBottomSheet(updatedTaskLists[0])}
                />
                <p className="tx-h1">Заработай больше монет</p>
            </div>
            <div className="list-task-container">
                <p className="tx-h2">Список заданий</p>
                {updatedTaskLists.map((task, index) => (
                    <ItemTask
                        key={index}
                        id={task.id}
                        text={task.text}
                        coins={task.coins}
                        completed={task.completed}
                        checkIcon={task.checkIcon}
                        taskType={task.taskType}
                        onClick={() => openBottomSheet(task)}
                    />
                ))}
            </div>
            {selectedTask && (
                <BottomSheetTask
                    isVisible={isBottomSheetVisible}
                    onClose={closeBottomSheet}
                    image={selectedTask.checkIcon}
                    title={selectedTask.text}
                    content={
                        <div className="sheet-task-container">
                            {isOpenUrlTask(selectedTask.taskType) && (
                                <button className="button-action-sheet"
                                        onClick={addedSuccessUrlSender}>
                                    <p className="tx-action-sheet">
                                        Подписаться
                                    </p>
                                </button>
                            )}

                            {isSampleTask(selectedTask.taskType) && (
                                <button className="button-action-sheet" onClick={closeBottomSheet}>
                                    <p className="tx-action-sheet">
                                        Продолжить
                                    </p>
                                </button>
                            )}

                            {CheckNftTask(selectedTask.taskType) && (
                                <div>
                                    <button
                                        className="button-action-sheet"
                                        onClick={checkNftItem}
                                        disabled={taskStates[selectedTask.id]?.isLoading}
                                    >
                                        <p className="tx-action-sheet">
                                            {taskStates[selectedTask.id]?.isLoading ? 'Проверяем...' : 'Проверить'}
                                        </p>
                                    </button>
                                    {!taskStates[selectedTask.id]?.isLoading && taskStates[selectedTask.id]?.checkResult && (
                                        taskStates[selectedTask.id]?.checkResult?.state ? (
                                            <div className="success-icon">
                                                ✅ Всё хорошо
                                            </div>
                                        ) : (
                                            <div className="error-message">
                                                У вас нет такой NFT
                                            </div>
                                        )
                                    )}
                                    {!taskStates[selectedTask.id]?.isLoading && taskStates[selectedTask.id]?.errorMessage && (
                                        <div className="error-message">
                                            {taskStates[selectedTask.id]?.errorMessage}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className='coins-container'>
                                <img src={CoinsIco} className='ic-coins' />
                                <span className="divider">+{selectedTask.coins}</span>
                            </div>
                        </div>
                    }
                />
            )}
        </div>
    );
}

export default TasksScreen;