import React, {createContext, useContext, useState, ReactNode, useEffect} from 'react';
import {UserBasic} from "../core/dataWork/RemoteUtilsRequester.ts";

// Определение интерфейсов

interface DataContextType {
    dataApp: UserBasic;
    setDataApp: React.Dispatch<React.SetStateAction<UserBasic>>;
    energy: number;
    setEnergy: React.Dispatch<React.SetStateAction<number>>;
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
    const [dataApp, setDataApp] = useState<UserBasic>(initialUserBasic);
    const [energy, setEnergy] = useState<number>(dataApp.maxEnergy); // Изначальное значение энергии

    useEffect(() => {
        const energyRegenInterval = setInterval(() => {
            setEnergy(prevEnergy => Math.min(prevEnergy + 1, dataApp.maxEnergy)); // Восстанавливаем энергию до максимума 2000
        }, 1000); // Восстанавливаем 1 энергию каждую секунду

        return () => clearInterval(energyRegenInterval);
    }, [dataApp.maxEnergy]);

    return (
        <DataContext.Provider value={{dataApp, setDataApp, energy, setEnergy}}>
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
