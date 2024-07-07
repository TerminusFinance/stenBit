import React, { useState } from 'react';
import './TaskSelector.css';

interface TaskSelectorProps {
    tabs: string[];
    onTabSelect: (selectedTab: string) => void;
}

const TaskSelector: React.FC<TaskSelectorProps> = ({ tabs, onTabSelect }) => {
    const [selectedTab, setSelectedTab] = useState<string>(tabs[0]);

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
