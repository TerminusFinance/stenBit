import React, {useState} from "react";
import './TasksScreen.css';
import coin from "../../../assets/ic_coins.png";
import ItemTask, {TaskCardProps, isOpenUrlTask, OpenUrlTask} from "./itemTask/ItemTask";
import TelegramIco from "../../../assets/ic_telegram.png";
import XIco from "../../../assets/ic_x.png";
import ProfileIco from "../../../assets/profile_ico.png";
import BottomSheetTask from "./bottomSheetTask/BottomSheetTask";
import CoinsIco from "../../../assets/ic_coins.png";
import {useData} from "../../DataContext.tsx";
import {updateUser} from "../../../core/dataWork/Back4app.ts";

const TasksScreen: React.FC = () => {

    const {dataApp, setDataApp} = useData();

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


    const addedSuccessUrlSender = async () => {
        const userId = dataApp.userId;
        const coindOld = dataApp.coins
        const completedTaskOld = dataApp.completedTasks || []; // Инициализируем пустой массив, если null

        if (selectedTask != null && userId != undefined && coindOld != undefined) {
            // Проверка типа задачи перед использованием свойства `url`
            if (isOpenUrlTask(selectedTask.taskType)) {
                window.open((selectedTask.taskType as OpenUrlTask).url, '_blank');

                // Добавляем идентификатор задачи в список завершенных задач
                if (!completedTaskOld.includes(selectedTask.id)) {
                    const updatedCompletedTasks = [...completedTaskOld, selectedTask.id];
                    console.log("updatedCompletedTasks - ", updatedCompletedTasks)
                    // Обновляем пользователя с новыми завершенными задачами
                    const resultUpdate = await updateUser(userId, { coins: coindOld + selectedTask.coins, completedTasks: updatedCompletedTasks });
                    setDataApp(resultUpdate);
                }
            }
        }
    };


    const itemTaskLists: TaskCardProps[] = [
        {
            id: 1, // Уникальный идентификатор
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
                            {isOpenUrlTask(selectedTask.taskType) ? (
                                <button className="button-action-sheet"
                                        onClick={addedSuccessUrlSender}>
                                    <p className="tx-action-sheet">
                                        Подписаться
                                    </p>
                                </button>
                            ) : (
                                <button className="button-action-sheet" onClick={closeBottomSheet}>
                                    <p className="tx-action-sheet">
                                        Продолжить
                                    </p>
                                </button>
                            )}
                            <div className='coins-container'>
                                <img src={CoinsIco} className='ic-coins'/>
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