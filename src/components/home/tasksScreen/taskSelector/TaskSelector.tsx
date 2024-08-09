import React, {useEffect, useState} from 'react';
import './TaskSelector.css';

interface TaskSelectorProps {
    tabs: string[];
    onTabSelect: (selectedTab: string) => void;
    firstSelectTab?: string;
}

const TaskSelector: React.FC<TaskSelectorProps> = ({ tabs, onTabSelect, firstSelectTab }) => {
    const [selectedTab, setSelectedTab] = useState<string>(firstSelectTab || tabs[0]);
    const [isFirstSelectTabSet, setIsFirstSelectTabSet] = useState<boolean>(!!firstSelectTab);

    useEffect(() => {
        // Вызов onTabSelect при начальной загрузке компонента, чтобы синхронизировать состояние с родительским компонентом
        onTabSelect(selectedTab);
    }, [selectedTab, onTabSelect]);

    useEffect(() => {
        // Обновление selectedTab при изменении firstSelectTab только если оно еще не было установлено
        if (firstSelectTab && !isFirstSelectTabSet) {
            setSelectedTab(firstSelectTab);
            onTabSelect(firstSelectTab);
            setIsFirstSelectTabSet(true);
        }
    }, [firstSelectTab, isFirstSelectTabSet, onTabSelect]);

    const handleTabClick = (tab: string) => {
        setSelectedTab(tab);
        onTabSelect(tab);
    };

    return (
        <div className="task-selector">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    className={`task-tab ${tab === selectedTab ? 'active' : ''}`}
                    onClick={() => handleTabClick(tab)}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
};

export default TaskSelector;
