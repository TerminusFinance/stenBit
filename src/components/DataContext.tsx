import React, {createContext, useContext, useState, ReactNode, useEffect} from 'react';
import {UserBasic} from "../core/dataWork/RemoteUtilsRequester.ts";

// Определение интерфейсов

interface DataContextType {
    dataApp: UserBasic;
    setDataApp: React.Dispatch<React.SetStateAction<UserBasic>>;
    energy: number;
    setEnergy: React.Dispatch<React.SetStateAction<number>>;
    turboBoost: string;
    setTurboBoost: React.Dispatch<React.SetStateAction<string>>;
}

// Создание контекста

const DataContext = createContext<DataContextType | undefined>(undefined);

// Создание провайдера

interface DataProviderProps {
    children: ReactNode;
}

const initialUserBasic: UserBasic = {
    userId: "",
    userName: "",
    coins: 0,
    codeToInvite: "",
    address: "",
    listUserInvited: [],
    currentEnergy: 0,
    maxEnergy: 1000,
    boosts: [],
    completedTasks: [],
    tasks: []
};

const DataProvider: React.FC<DataProviderProps> = ({children}) => {
    const [dataApp, setDataApp] = useState<UserBasic>(() => {
        const storedData = localStorage.getItem('dataApp');
        return storedData ? JSON.parse(storedData) : initialUserBasic;
    });

    const [energy, setEnergy] = useState<number>(dataApp.currentEnergy ?? dataApp.maxEnergy);
    const [turboBoost, setTurboBoost] = useState<string>(() => {
        const storedTurboBoost = localStorage.getItem('turboBoost');
        return storedTurboBoost ?? "";
    });

    useEffect(() => {
        if (dataApp.currentEnergy !== undefined) {
            setEnergy(dataApp.currentEnergy);
        }
    }, [dataApp.currentEnergy]);

    useEffect(() => {
        const energyRegenInterval = setInterval(() => {
            // Определите скорость регенерации на основе turboBoost
            const plusItem = turboBoost === 'active' ? (dataApp.premium?.endDateOfWork !== undefined ? 4 : 2) : (dataApp.premium?.endDateOfWork !== undefined ? 2 : 1);
            setEnergy(prevEnergy => Math.min(prevEnergy + plusItem, dataApp.maxEnergy));
        }, 1000);

        return () => clearInterval(energyRegenInterval);
    }, [dataApp.maxEnergy, dataApp.premium?.endDateOfWork, turboBoost]);

    useEffect(() => {
        localStorage.setItem('dataApp', JSON.stringify(dataApp));
        localStorage.setItem('turboBoost', turboBoost);
    }, [dataApp, turboBoost]);

    return (
        <DataContext.Provider value={{dataApp, setDataApp, energy, setEnergy, turboBoost, setTurboBoost}}>
            {children}
        </DataContext.Provider>
    );
};

// Кастомный хук для использования контекста

const useData = (): DataContextType => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

export {DataProvider, useData};
